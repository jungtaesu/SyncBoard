/**
 * StatusActionBar — Client Component
 *
 * [학습 포인트]
 * 상태 변경은 사용자 액션(click) + WebSocket 전송이 필요하므로 Client Component.
 * 현재 상태는 Zustand에서 읽는다 (WebSocket delta로 업데이트된 최신 상태).
 *
 * Optimistic UI 패턴 예시:
 * 서버 응답을 기다리지 않고 UI를 먼저 변경하고,
 * status_changed 이벤트 수신 시 확정 처리한다.
 */

"use client";

import { useRoomStore } from "@/shared/stores/room-store";
import { useSocketStore } from "@/shared/stores/socket-store";
import { send } from "@/shared/websocket/connection-manager";
import type { RoomStatus } from "@/shared/websocket/types";

const STATUS_OPTIONS: { value: RoomStatus; label: string; color: string }[] = [
  { value: "open", label: "Open", color: "bg-red-100 text-red-700 hover:bg-red-200" },
  { value: "investigating", label: "Investigating", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
  { value: "resolved", label: "Resolved", color: "bg-green-100 text-green-700 hover:bg-green-200" },
];

export function StatusActionBar() {
  const roomId = useRoomStore((s) => s.roomId);
  const currentStatus = useRoomStore((s) => s.status);
  const setRoomStatus = useRoomStore((s) => s.setRoomStatus);
  const socketStatus = useSocketStore((s) => s.status);
  const isConnected = socketStatus === "open";

  function handleStatusChange(status: RoomStatus) {
    if (!roomId || status === currentStatus) return;

    // Optimistic: 로컬 상태 먼저 변경
    setRoomStatus(status);

    // 서버로 change_status 이벤트 전송
    send({ type: "change_status", roomId, status });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-xs font-medium text-slate-500">상태 변경:</span>
      {STATUS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleStatusChange(opt.value)}
          disabled={!isConnected || currentStatus === opt.value}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${opt.color} disabled:opacity-40 disabled:cursor-not-allowed ring-2 ${
            currentStatus === opt.value ? "ring-current" : "ring-transparent"
          }`}
        >
          {opt.label}
          {currentStatus === opt.value && " ✓"}
        </button>
      ))}
    </div>
  );
}
