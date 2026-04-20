/**
 * app/(dashboard)/rooms/[roomId]/layout.tsx — 룸 상세 Layout (Server Component)
 *
 * [학습 포인트]
 * 1) Parallel Routes: @activity, @members 슬롯을 동시에 렌더링한다.
 *    같은 layout 안에서 여러 독립적인 페이지를 병렬로 보여줄 수 있다.
 *    URL은 /rooms/room-001 하나이지만 @activity와 @members가 동시에 렌더링된다.
 *
 * 2) layout.tsx는 route segment를 이동해도 unmount되지 않는다.
 *    → 공통 헤더를 여기 두면 페이지 이동 시 flicker 없이 유지된다.
 *
 * Next.js 공식: parallel routes는 독립적인 streaming과 error/loading 처리를 지원한다.
 */

import { ConnectionStatus } from "@/features/issue-room/ui/ConnectionStatus";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  activity: React.ReactNode;   // @activity 슬롯
  members: React.ReactNode;    // @members 슬롯
}

export default function RoomDetailLayout({ children, activity, members }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* 공통 상단 바 */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/rooms" className="text-sm text-slate-400 hover:text-slate-700">
          ← 목록으로
        </Link>
        <div className="ml-auto">
          {/* ConnectionStatus는 Client Component: 소켓 상태 표시 */}
          <ConnectionStatus />
        </div>
      </div>

      {/* 메인 그리드 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 왼쪽 2/3: 룸 상세 (page.tsx) + activity 피드 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {children}
          {/* @activity parallel route 슬롯 */}
          {activity}
        </div>

        {/* 오른쪽 1/3: 멤버 패널 */}
        <div className="flex flex-col gap-4">
          {/* @members parallel route 슬롯 */}
          {members}
        </div>
      </div>
    </div>
  );
}
