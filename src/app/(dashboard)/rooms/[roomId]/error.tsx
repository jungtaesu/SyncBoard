/**
 * app/(dashboard)/rooms/[roomId]/error.tsx
 *
 * 룸 상세 세그먼트의 Error Boundary.
 * 상위 rooms/error.tsx와 별개로 동작한다.
 * 룸이 없거나 fetch 실패 시 여기서 처리한다.
 */

"use client";

import Link from "next/link";

export default function RoomDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <p className="text-5xl">🔥</p>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">룸을 불러오지 못했습니다</h2>
      <p className="mt-2 text-sm text-slate-500">{error.message}</p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          다시 시도
        </button>
        <Link
          href="/rooms"
          className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          목록으로
        </Link>
      </div>
    </div>
  );
}
