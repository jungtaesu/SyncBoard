/**
 * ConnectionStatus — Client Component
 *
 * WebSocket 연결 상태 표시 배지.
 * 상단 레이아웃에 고정하면 연결 상태를 항상 볼 수 있다.
 */

"use client";

import { useSocketStore, type SocketStatus } from "@/shared/stores/socket-store";

const STATUS_CONFIG: Record<SocketStatus, { label: string; color: string; dot: string }> = {
  idle: { label: "대기", color: "text-slate-500", dot: "bg-slate-300" },
  connecting: { label: "연결 중…", color: "text-blue-600", dot: "bg-blue-400 animate-pulse" },
  open: { label: "연결됨", color: "text-green-700", dot: "bg-green-400" },
  closed: { label: "연결 끊김", color: "text-slate-500", dot: "bg-slate-400" },
  reconnecting: { label: "재연결 중…", color: "text-yellow-600", dot: "bg-yellow-400 animate-pulse" },
  failed: { label: "연결 실패", color: "text-red-600", dot: "bg-red-500" },
};

export function ConnectionStatus() {
  const status = useSocketStore((s) => s.status);
  const reconnectAttempts = useSocketStore((s) => s.reconnectAttempts);
  const cfg = STATUS_CONFIG[status];

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
      <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
      {status === "reconnecting" && reconnectAttempts > 0 && (
        <span className="text-slate-400">({reconnectAttempts}번째)</span>
      )}
    </div>
  );
}
