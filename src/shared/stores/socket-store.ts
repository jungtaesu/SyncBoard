/**
 * shared/stores/socket-store.ts
 *
 * [학습 포인트]
 * WebSocket 연결 상태만 담는다.
 * 룸 데이터(메시지, 멤버)는 room-store.ts에 분리한다.
 *
 * Zustand에 넣기 적합한 것:
 *   - 연결 상태 (connecting / open / closed / reconnecting / failed)
 *   - 현재 유저 정보 (userId, userName)
 *   - 재연결 횟수
 *
 * Next.js App Router에서는 Zustand 스토어를 서버 컴포넌트에서 직접 쓰지 않는다.
 * 서버 컴포넌트는 Zustand 없이 fetch로 데이터를 가져온다.
 * Zustand는 오직 Client Component에서만 사용한다.
 */

import { create } from "zustand";

export type SocketStatus = "idle" | "connecting" | "open" | "closed" | "reconnecting" | "failed";

interface SocketState {
  status: SocketStatus;
  reconnectAttempts: number;
  currentUserId: string;
  currentUserName: string;

  setStatus: (status: SocketStatus) => void;
  setReconnectAttempts: (n: number) => void;
  setUser: (userId: string, userName: string) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  status: "idle",
  reconnectAttempts: 0,
  currentUserId: `user_${Math.random().toString(36).slice(2, 8)}`,
  currentUserName: "Anonymous",

  setStatus: (status) => set({ status }),
  setReconnectAttempts: (reconnectAttempts) => set({ reconnectAttempts }),
  setUser: (currentUserId, currentUserName) => set({ currentUserId, currentUserName }),
}));
