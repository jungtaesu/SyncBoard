/**
 * RoomCard — Server Component
 *
 * [학습 포인트]
 * 'use client' 없음 → 기본적으로 Server Component.
 * 상태, 이벤트 핸들러, 브라우저 API가 없으므로 서버에서 렌더링한다.
 */

import Link from "next/link";
import type { RoomListItem } from "@/shared/mocks/data";

const STATUS_BADGE: Record<string, string> = {
  open: "bg-red-100 text-red-700",
  investigating: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
};

const PRIORITY_BADGE: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-800 font-bold",
};

interface Props {
  room: RoomListItem;
}

export function RoomCard({ room }: Props) {
  const lastEvent = new Date(room.lastEventAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-slate-300"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">{room.title}</h2>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[room.status] ?? ""}`}
        >
          {room.status}
        </span>
      </div>

      <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">{room.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span className={`rounded-full px-2 py-0.5 ${PRIORITY_BADGE[room.priority] ?? ""}`}>
          {room.priority}
        </span>
        <span>이슈 {room.openIssueCount}건</span>
        <span>참여자 {room.memberCount}명</span>
        <span className="ml-auto">최근 이벤트 {lastEvent}</span>
      </div>
    </Link>
  );
}
