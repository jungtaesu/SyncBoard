/**
 * app/(dashboard)/rooms/error.tsx
 *
 * [학습 포인트]
 * error.tsx는 Error Boundary를 자동으로 만든다.
 * 이 세그먼트(rooms/) 내에서 발생한 오류를 여기서 잡는다.
 * 반드시 'use client'여야 한다 — Error Boundary는 클라이언트 기능이다.
 *
 * reset()을 호출하면 현재 세그먼트를 다시 렌더링 시도한다.
 */

"use client";

export default function RoomsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <p className="text-5xl">⚠️</p>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">룸 목록을 불러오지 못했습니다</h2>
      <p className="mt-2 text-sm text-slate-500">{error.message}</p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        다시 시도
      </button>
    </div>
  );
}
