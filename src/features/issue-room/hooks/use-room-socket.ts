/**
 * features/issue-room/hooks/use-room-socket.ts
 *
 * [학습 포인트]
 * WebSocket 연결 라이프사이클과 이벤트 구독을 컴포넌트에서 분리한다.
 *
 * 이 훅 하나만 쓰면:
 *   - 룸 입장 시 connect + joinRoom
 *   - 언마운트 시 leaveRoom + disconnect
 *   - 서버 이벤트(message, status, presence 등) 수신 → 스토어 반영
 *
 * 컴포넌트는 이 훅을 호출하기만 하면 WebSocket 세부 사항을 몰라도 된다.
 * 'use client' 컴포넌트에서만 사용한다.
 */

"use client";

import { useEffect } from "react";
import { connect, joinRoom, leaveRoom, disconnect } from "@/shared/websocket/connection-manager";
import { eventBus } from "@/shared/websocket/event-bus";
import { useRoomStore } from "@/shared/stores/room-store";
import type { RoomMeta, Message, User, RoomStatus } from "@/shared/websocket/types";

interface UseRoomSocketOptions {
  /** App Router SSR이 미리 가져온 초기 snapshot (optional) */
  initialSnapshot?: {
    room: RoomMeta;
    messages: Message[];
    members: User[];
  };
}

export function useRoomSocket(roomId: string, options: UseRoomSocketOptions = {}) {
  const { applySnapshot, addMessage, setMembers, setRoomStatus, reset } = useRoomStore();

  useEffect(() => {
    // 1) SSR snapshot이 있으면 즉시 스토어에 반영 (화면 깜빡임 방지)
    if (options.initialSnapshot) {
      applySnapshot(options.initialSnapshot);
    }

    // 2) WebSocket 연결 및 룸 입장
    connect();
    joinRoom(roomId);

    // 3) 서버 이벤트 구독 → eventBus.on은 cleanup 함수를 반환
    const unsubSnapshot = eventBus.on<Extract<import("@/shared/websocket/types").ServerEvent, { type: "sync_snapshot" }>>(
      "sync_snapshot",
      (ev) => {
        applySnapshot({ room: ev.room, messages: ev.messages, members: ev.members });
      },
    );

    const unsubMessage = eventBus.on<Extract<import("@/shared/websocket/types").ServerEvent, { type: "message_received" }>>(
      "message_received",
      (ev) => {
        addMessage(ev.message);
      },
    );

    const unsubPresence = eventBus.on<Extract<import("@/shared/websocket/types").ServerEvent, { type: "presence_updated" }>>(
      "presence_updated",
      (ev) => {
        setMembers(ev.users as User[]);
      },
    );

    const unsubStatus = eventBus.on<Extract<import("@/shared/websocket/types").ServerEvent, { type: "status_changed" }>>(
      "status_changed",
      (ev) => {
        setRoomStatus(ev.status as RoomStatus);
      },
    );

    // 4) cleanup: 룸 퇴장 + 구독 해제
    return () => {
      leaveRoom(roomId);
      unsubSnapshot();
      unsubMessage();
      unsubPresence();
      unsubStatus();
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);
}
