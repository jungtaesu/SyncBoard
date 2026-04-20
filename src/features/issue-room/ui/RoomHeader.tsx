/**
 * RoomHeader — Server Component
 *
 * [학습 포인트]
 * 룸 제목, 생성 시간, 현재 상태는 초기 로드 시 변하지 않는다.
 * → 서버에서 렌더링하면 클라이언트 JS bundle에 포함되지 않는다.
 * → 실시간 상태 변경은 StatusActionBar(Client Component)가 처리한다.
 */

import type { RoomMeta } from "@/shared/websocket/types";

const STATUS_COLOR: Record<string, string> = {
  open: "text-red-600",
  investigating: "text-yellow-600",
  resolved: "text-green-600",
};

interface Props {
  room: RoomMeta;
}

export function RoomHeader({ room }: Props) {
  const created = new Date(room.createdAt).toLocaleString("ko-KR");

  return (
    <div className="border-b border-slate-200 pb-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{room.title}</h1>
        <span className={`text-sm font-semibold uppercase ${STATUS_COLOR[room.status] ?? ""}`}>
          [{room.status}]
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-400">
        생성: {created} · 우선순위: <strong>{room.priority}</strong>
      </p>
    </div>
  );
}
