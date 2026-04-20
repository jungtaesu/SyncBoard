/**
 * features/issue-room/api/index.ts
 *
 * [학습 포인트]
 * 서버 컴포넌트에서 직접 호출하는 fetch 함수들.
 * 이 파일의 함수는 'use client' 컴포넌트에서 호출하지 않는다.
 *
 * App Router에서는 fetch를 서버 컴포넌트 안에서 직접 쓰고,
 * Next.js가 자동으로 deduplicate / cache 한다.
 */

import {
  getRooms,
  getRoomById,
  getRecentMessages,
  getRoomMembers,
  getRoomMetrics,
} from "@/shared/mocks/data";
import type { RoomStatus, RoomPriority } from "@/shared/websocket/types";

export async function fetchRoomList(filter?: { status?: RoomStatus; priority?: RoomPriority }) {
  return getRooms(filter);
}

export async function fetchRoomSnapshot(roomId: string) {
  const [room, messages, members] = await Promise.all([
    getRoomById(roomId),
    getRecentMessages(roomId),
    getRoomMembers(roomId),
  ]);

  if (!room) return null;

  return { room, messages, members };
}

export { getRoomById, getRoomMetrics };
