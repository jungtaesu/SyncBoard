/**
 * shared/stores/room-store.ts
 *
 * [학습 포인트]
 * 룸의 실시간 상태 (메시지, 멤버, 현재 status 등)를 담는다.
 *
 * 초기 snapshot은 서버(SSR/RSC)에서 fetch한다.
 * 이후 WebSocket delta 이벤트로 클라이언트 측에서 업데이트한다.
 *
 * "서버 → 초기 데이터 / WebSocket → 이후 변경분"이 이 스토어에서 만난다.
 */

import { create } from "zustand";
import type { Message, User, RoomStatus, RoomMeta } from "@/shared/websocket/types";

interface RoomState {
  roomId: string | null;
  roomMeta: RoomMeta | null;
  messages: Message[];
  members: User[];
  status: RoomStatus | null;

  // snapshot으로 초기 데이터 세팅 (서버에서 SSR된 데이터 + sync_snapshot 이벤트 모두 처리)
  applySnapshot: (snapshot: {
    room: RoomMeta;
    messages: Message[];
    members: User[];
  }) => void;

  // 실시간 delta 이벤트 반영
  addMessage: (message: Message) => void;
  setMembers: (users: User[]) => void;
  setRoomStatus: (status: RoomStatus) => void;

  reset: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  roomId: null,
  roomMeta: null,
  messages: [],
  members: [],
  status: null,

  applySnapshot: (snapshot) =>
    set({
      roomId: snapshot.room.id,
      roomMeta: snapshot.room,
      messages: snapshot.messages,
      members: snapshot.members,
      status: snapshot.room.status,
    }),

  addMessage: (message) =>
    set((state) => ({
      // 중복 방지: 이미 존재하는 id면 skip
      messages: state.messages.some((m) => m.id === message.id)
        ? state.messages
        : [...state.messages, message],
    })),

  setMembers: (members) => set({ members }),

  setRoomStatus: (status) =>
    set((state) => ({
      status,
      roomMeta: state.roomMeta ? { ...state.roomMeta, status } : null,
    })),

  reset: () =>
    set({ roomId: null, roomMeta: null, messages: [], members: [], status: null }),
}));
