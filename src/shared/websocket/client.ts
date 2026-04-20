/**
 * shared/websocket/client.ts
 *
 * [학습 포인트]
 * WebSocket 저수준 래퍼 (생성 / 종료 / 전송).
 * 재연결 / 룸 구독 / 이벤트 분배는 이 파일에서 하지 않는다.
 * 역할 분리: 이 파일은 브라우저 WebSocket API를 감쌀 뿐이다.
 *
 * MDN WebSocket API: https://developer.mozilla.org/ko/docs/Web/API/WebSocket
 */

import { serialize } from "./serializers";
import { deserialize } from "./serializers";
import { eventBus } from "./event-bus";
import type { ClientEvent } from "./types";

let socket: WebSocket | null = null;
const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3000/ws";

/** 현재 WebSocket 인스턴스를 반환한다. */
export function getSocket(): WebSocket | null {
  return socket;
}

/**
 * WebSocket 연결을 생성한다.
 * 이미 OPEN 상태라면 재생성하지 않는다.
 */
export function createSocket(
  onOpen?: () => void,
  onClose?: (ev: CloseEvent) => void,
  onError?: (ev: Event) => void,
): WebSocket {
  if (socket && socket.readyState === WebSocket.OPEN) return socket;

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.debug("[WS] connected");
    onOpen?.();
  };

  socket.onmessage = (ev: MessageEvent<string>) => {
    const event = deserialize(ev.data);
    if (event) {
      eventBus.emit(event); // 이벤트 버스로 분배
    } else {
      console.warn("[WS] unrecognized message:", ev.data);
    }
  };

  socket.onclose = (ev) => {
    console.debug("[WS] closed", ev.code, ev.reason);
    socket = null;
    onClose?.(ev);
  };

  socket.onerror = (ev) => {
    console.error("[WS] error", ev);
    onError?.(ev);
  };

  return socket;
}

/**
 * 이벤트를 서버로 전송한다.
 * 연결이 OPEN이 아니면 false를 반환한다.
 */
export function sendEvent(event: ClientEvent): boolean {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("[WS] send failed: socket not open");
    return false;
  }
  socket.send(serialize(event));
  return true;
}

/** WebSocket 연결을 정상 종료한다. */
export function closeSocket(code = 1000, reason = "client close"): void {
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    socket.close(code, reason);
  }
}
