/**
 * shared/websocket/connection-manager.ts
 *
 * [학습 포인트]
 * 재연결, heartbeat, 룸 subscribe/unsubscribe를 관리하는 레이어.
 *
 * client.ts가 "어떻게 연결하는가"라면,
 * connection-manager.ts는 "언제 연결하고 끊는가"를 담당한다.
 *
 * 재연결 전략:
 *   - 지수 백오프(exponential backoff): 실패할수록 재시도 간격을 늘린다
 *   - max retry 횟수 초과 시 포기하고 사용자에게 알림
 */

import { createSocket, closeSocket, sendEvent } from "./client";
import { useSocketStore } from "@/shared/stores/socket-store";
import type { ClientEvent } from "./types";

// ── 재연결 설정 ─────────────────────────────────────────────

const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;
const RECONNECT_MAX_ATTEMPTS = 8;

let reconnectAttempts = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let pendingRoomId: string | null = null; // 재연결 시 자동 재입장

// ── 연결 시작 ───────────────────────────────────────────────

export function connect(): void {
  const { setStatus, setReconnectAttempts } = useSocketStore.getState();
  setStatus("connecting");

  createSocket(
    // onOpen
    () => {
      reconnectAttempts = 0;
      setStatus("open");
      setReconnectAttempts(0);

      // 재연결이었다면 이전 룸으로 자동 재입장
      if (pendingRoomId) {
        joinRoom(pendingRoomId);
      }
    },
    // onClose
    (ev) => {
      // 1000(정상) / 1001(탭 닫음) 은 재연결 안 함
      if (ev.code === 1000 || ev.code === 1001) {
        setStatus("closed");
        return;
      }
      scheduleReconnect();
    },
    // onError
    () => {
      scheduleReconnect();
    },
  );
}

// ── 재연결 스케줄러 (지수 백오프) ──────────────────────────

function scheduleReconnect(): void {
  const { setStatus, setReconnectAttempts } = useSocketStore.getState();

  if (reconnectAttempts >= RECONNECT_MAX_ATTEMPTS) {
    setStatus("failed");
    console.error("[WS] max reconnect attempts reached");
    return;
  }

  const delay = Math.min(
    RECONNECT_BASE_MS * 2 ** reconnectAttempts,
    RECONNECT_MAX_MS,
  );
  reconnectAttempts++;
  setReconnectAttempts(reconnectAttempts);
  setStatus("reconnecting");

  console.debug(`[WS] reconnecting in ${delay}ms (attempt ${reconnectAttempts})`);

  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(() => {
    connect();
  }, delay);
}

// ── 룸 입/퇴장 ──────────────────────────────────────────────

export function joinRoom(roomId: string): boolean {
  const { currentUserId, currentUserName } = useSocketStore.getState();
  pendingRoomId = roomId;

  const event: ClientEvent = {
    type: "join_room",
    roomId,
    userId: currentUserId,
    userName: currentUserName,
  };
  return sendEvent(event);
}

export function leaveRoom(roomId: string): boolean {
  pendingRoomId = null;
  return sendEvent({ type: "leave_room", roomId });
}

// ── 일반 이벤트 전송 ─────────────────────────────────────────

export function send(event: ClientEvent): boolean {
  return sendEvent(event);
}

// ── 연결 종료 ────────────────────────────────────────────────

export function disconnect(): void {
  pendingRoomId = null;
  if (reconnectTimer) clearTimeout(reconnectTimer);
  closeSocket(1000, "user disconnect");
  useSocketStore.getState().setStatus("closed");
}
