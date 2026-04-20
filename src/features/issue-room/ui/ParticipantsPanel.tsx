/**
 * ParticipantsPanel — hybrid: Server Component 껍데기 + Client island
 *
 * [학습 포인트]
 * "Server Component로 초기 렌더 후, 내부 client island로 presence 반영"
 *
 * 이 파일(ParticipantsPanel)은 Server Component:
 *   - 초기 멤버 목록을 props로 받아 렌더링
 *
 * 내부의 LivePresence는 Client Component:
 *   - Zustand 스토어를 구독해 WebSocket presence 업데이트를 반영
 *
 * 이렇게 쪼개면 초기 HTML에 멤버 목록이 포함되고(SEO / 빠른 첫 렌더),
 * 이후 WebSocket 이벤트로 실시간 갱신된다.
 */

import type { User } from "@/shared/websocket/types";
import { LivePresence } from "./LivePresence";

interface Props {
  initialMembers: User[];
}

// Server Component
export function ParticipantsPanel({ initialMembers }: Props) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">참여자</h3>
      {/* LivePresence는 Client Component: 실시간 presence 담당 */}
      <LivePresence initialMembers={initialMembers} />
    </aside>
  );
}
