/**
 * ActivityFeed — Client Component
 *
 * [학습 포인트]
 * WebSocket으로 실시간 메시지를 수신하므로 반드시 Client Component여야 한다.
 * Zustand 스토어(useRoomStore)를 구독해 메시지 목록을 렌더링한다.
 *
 * 'use client' 경계 최소화 원칙:
 * 이 컴포넌트의 자식이 정적 UI(말풍선 등)라면 Server Component로 추출할 수 있지만,
 * 메시지 목록 전체가 실시간으로 업데이트되므로 여기선 같이 넣는다.
 */

"use client";

import { useRoomStore } from "@/shared/stores/room-store";
import { useEffect, useRef } from "react";

export function ActivityFeed() {
  const messages = useRoomStore((s) => s.messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 올 때마다 스크롤 하단으로 이동
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <section className="flex flex-col gap-2 overflow-y-auto" aria-label="메시지 피드">
      {messages.length === 0 && (
        <p className="py-8 text-center text-sm text-slate-400">아직 메시지가 없습니다.</p>
      )}
      {messages.map((msg) => (
        <div key={msg.id} className="flex flex-col gap-0.5 rounded-lg bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">{msg.userName}</span>
            <time className="text-xs text-slate-400">
              {new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
          <p className="text-sm text-slate-800">{msg.text}</p>
        </div>
      ))}
      <div ref={bottomRef} />
    </section>
  );
}
