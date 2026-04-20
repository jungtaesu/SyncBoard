/**
 * MetricModal — Client Component
 *
 * Intercepting Route로 띄우는 모달.
 * 뒤로가기(router.back())로 닫는다.
 */

"use client";

import { useRouter } from "next/navigation";

interface Metric {
  id: string;
  roomId: string;
  label: string;
  value: string;
  trend: "up" | "down";
  updatedAt: string;
  history: { t: string; v: number }[];
}

interface Props {
  metric: Metric;
}

export function MetricModal({ metric }: Props) {
  const router = useRouter();

  return (
    // 백드롭
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => router.back()}
    >
      {/* 모달 패널 */}
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => router.back()}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
          aria-label="닫기"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-slate-900">{metric.label}</h2>
        <p className="mt-1 text-sm text-slate-400">
          업데이트:{" "}
          {new Date(metric.updatedAt).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-4xl font-extrabold text-slate-900">{metric.value}</span>
          <span className={`text-2xl ${metric.trend === "up" ? "text-red-500" : "text-green-500"}`}>
            {metric.trend === "up" ? "↑" : "↓"}
          </span>
        </div>

        {/* 간단한 bar chart */}
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium text-slate-500">최근 10개 포인트</p>
          <div className="flex h-16 items-end gap-1">
            {metric.history.map((point, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-indigo-400"
                style={{ height: `${Math.max(4, (point.v / 20) * 100)}%` }}
                title={`${point.v.toFixed(1)}`}
              />
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          URL: /rooms/{metric.roomId}/metrics/{metric.id}
          <br />
          (intercepting route: 룸 상세를 유지하면서 모달로 렌더링)
        </p>
      </div>
    </div>
  );
}
