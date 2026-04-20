/**
 * MessageComposer — Client Component
 *
 * [학습 포인트]
 * 입력 상태(useState), 이벤트 핸들러(onChange/onSubmit), 브라우저 API — 모두 Client 필수.
 * WebSocket 전송은 connection-manager.send()를 호출한다.
 * 컴포넌트가 WebSocket 직접 참조하지 않는다 → 레이어 분리.
 */

"use client";

import { useState, type FormEvent } from "react";
import { send } from "@/shared/websocket/connection-manager";
import { useRoomStore } from "@/shared/stores/room-store";
import { useSocketStore } from "@/shared/stores/socket-store";

export function MessageComposer() {
  const [text, setText] = useState("");
  const roomId = useRoomStore((s) => s.roomId);
  const socketStatus = useSocketStore((s) => s.status);
  const isConnected = socketStatus === "open";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || !roomId) return;

    const sent = send({ type: "send_message", roomId, text: text.trim() });
    if (sent) setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 pt-3 border-t border-slate-200">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!isConnected}
        placeholder={isConnected ? "메시지를 입력하세요…" : "연결 중…"}
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 disabled:bg-slate-50 disabled:text-slate-400"
      />
      <button
        type="submit"
        disabled={!isConnected || !text.trim()}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        전송
      </button>
    </form>
  );
}
