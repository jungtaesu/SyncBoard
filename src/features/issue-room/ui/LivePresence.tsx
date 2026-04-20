/**
 * LivePresence — Client Component
 *
 * [학습 포인트]
 * ParticipantsPanel(Server)의 자식 Client island.
 * 'use client' 경계는 여기서 시작된다.
 *
 * initialMembers prop으로 SSR 초기값을 받고,
 * Zustand를 통해 WebSocket presence 업데이트를 반영한다.
 */

"use client";

import { useRoomStore } from "@/shared/stores/room-store";
import type { User } from "@/shared/websocket/types";

interface Props {
  initialMembers: User[];
}

export function LivePresence({ initialMembers }: Props) {
  // Zustand에 멤버가 있으면 실시간 데이터를, 없으면 SSR 초기값 사용
  const liveMembers = useRoomStore((s) => s.members);
  const members = liveMembers.length > 0 ? liveMembers : initialMembers;

  return (
    <ul className="flex flex-col gap-2">
      {members.map((user) => (
        <li key={user.id} className="flex items-center gap-2 text-sm text-slate-700">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
            {user.name[0].toUpperCase()}
          </span>
          {user.name}
          <span className="ml-auto h-2 w-2 rounded-full bg-green-400" aria-label="온라인" />
        </li>
      ))}
      {members.length === 0 && (
        <li className="text-xs text-slate-400">현재 참여자 없음</li>
      )}
    </ul>
  );
}
