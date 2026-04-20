/**
 * app/(dashboard)/rooms/[roomId]/metrics/[metricId]/page.tsx
 * 실제 메트릭 페이지 (직접 URL 접근 시 / 새로고침 시)
 *
 * [학습 포인트]
 * Intercepting route가 아닌 실제 페이지.
 * 새로고침하면 이 파일이 렌더링된다 (모달 아님).
 */

import { getRoomMetrics } from "@/features/issue-room/api";
import Link from "next/link";

interface Props {
  params: Promise<{ roomId: string; metricId: string }>;
}

export default async function MetricPage({ params }: Props) {
  const { roomId, metricId } = await params;
  const metric = await getRoomMetrics(roomId, metricId);

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <Link href={`/rooms/${roomId}`} className="text-sm text-slate-400 hover:text-slate-700">
        ← 룸으로 돌아가기
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{metric.label}</h1>
      <p className="mt-1 text-slate-500">Room: {roomId}</p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="text-5xl font-extrabold text-slate-900">{metric.value}</span>
          <span className={`text-3xl ${metric.trend === "up" ? "text-red-500" : "text-green-500"}`}>
            {metric.trend === "up" ? "↑" : "↓"}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          새로고침하면 이 페이지 직접 렌더링 (intercepting route 비활성)
        </p>
      </div>
    </div>
  );
}
