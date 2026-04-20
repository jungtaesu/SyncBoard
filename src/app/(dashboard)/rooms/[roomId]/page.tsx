/**
 * app/(dashboard)/rooms/[roomId]/page.tsx — 룸 상세 페이지
 *
 * [학습 포인트 - 핵심]
 * "초기 snapshot은 서버, 이후 delta는 WebSocket" 구조의 진입점.
 *
 * 1) 이 파일 자체는 Server Component (async 함수)
 *    → 서버에서 룸 메타/메시지/멤버를 fetch해서 HTML을 완성한다.
 *
 * 2) RoomSocketProvider (Client Component)에 initialSnapshot을 props로 전달
 *    → Client Component가 마운트되면 WebSocket 연결 시작
 *    → 이후 실시간 delta를 Zustand 스토어에 반영
 *
 * 3) RoomHeader, RoomHistorySummary는 Server Component
 *    → JS 없이 HTML로 전달, hydration 비용 없음
 *
 * 4) ActivityFeed, MessageComposer, StatusActionBar는 Client Component
 *    → WebSocket 이벤트 수신, 입력 처리
 *
 * 이 구조로 묻는 질문:
 *   "왜 RoomHeader는 Server이고 ActivityFeed는 Client인가?"
 *   → RoomHeader는 정적 데이터 + 이벤트 핸들러 없음
 *   → ActivityFeed는 실시간 업데이트 + useEffect 필요
 */

import { notFound } from "next/navigation";
import { fetchRoomSnapshot } from "@/features/issue-room/api";
import { RoomHeader } from "@/features/issue-room/ui/RoomHeader";
import { RoomHistorySummary } from "@/features/issue-room/ui/RoomHistorySummary";
import { StatusActionBar } from "@/features/issue-room/ui/StatusActionBar";
import { ActivityFeed } from "@/features/issue-room/ui/ActivityFeed";
import { MessageComposer } from "@/features/issue-room/ui/MessageComposer";
import { RoomSocketProvider } from "@/features/issue-room/ui/RoomSocketProvider";
import Link from "next/link";

interface Props {
  params: Promise<{ roomId: string }>;
}

export default async function RoomDetailPage({ params }: Props) {
  const { roomId } = await params;
  const snapshot = await fetchRoomSnapshot(roomId);

  if (!snapshot) notFound();

  const { room, messages, members } = snapshot;

  return (
    // RoomSocketProvider: Client island — WebSocket 연결 + 스토어 초기화
    // children으로 Server/Client 컴포넌트 모두 전달 가능
    <RoomSocketProvider roomId={roomId} initialSnapshot={{ room, messages, members }}>
      <div className="flex flex-col gap-6">

        {/* ── Server Component: 정적 헤더 ─────────────────── */}
        <RoomHeader room={room} />

        {/* ── Client Component: 상태 변경 액션 ───────────── */}
        <StatusActionBar />

        {/* ── 메트릭 링크 (intercepting route 연결) ────────── */}
        <div className="flex gap-3 text-sm">
          <Link
            href={`/rooms/${roomId}/metrics/error-rate`}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50"
          >
            📊 Error Rate
          </Link>
          <Link
            href={`/rooms/${roomId}/metrics/latency-p99`}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50"
          >
            ⏱ Latency P99
          </Link>
        </div>

        {/* ── Client Component: 실시간 메시지 피드 ────────── */}
        <div className="flex-1 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-700">메시지</h3>
          <ActivityFeed />
          <MessageComposer />
        </div>

        {/* ── Server Component: 룸 통계 요약 ─────────────── */}
        <RoomHistorySummary room={{ ...room, openIssueCount: 0, lastEventAt: room.updatedAt, description: "" }} />
      </div>
    </RoomSocketProvider>
  );
}
