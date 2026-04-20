/**
 * app/(public)/page.tsx — 홈 페이지 (Server Component)
 */

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
      <h1 className="text-4xl font-extrabold text-slate-900">
        Issue<span className="text-indigo-600">Pulse</span>
      </h1>
      <p className="mt-4 max-w-md text-slate-500">
        App Router의 서버/클라이언트 렌더링 경계와 WebSocket 계층 설계를
        의도적으로 드러내는 실시간 이슈룸 대시보드
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/rooms"
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          App Router 버전 →
        </Link>
        <Link
          href="/legacy/rooms/room-001"
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Pages Router 버전 →
        </Link>
      </div>
    </div>
  );
}
