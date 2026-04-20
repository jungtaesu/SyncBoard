/**
 * ActivityFeed - Client Component
 *
 * WebSocket으로 들어온 메시지를 Zustand store에서 읽어 렌더링한다.
 */

"use client";

import { useRoomStore } from "@/shared/stores/room-store";
import { useEffect, useRef } from "react";
import styles from "./ActivityFeed.module.css";

export function ActivityFeed() {
  const messages = useRoomStore((s) => s.messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <section className={styles.feed} aria-label="메시지 피드">
      {messages.length === 0 && (
        <p className={styles.empty}>아직 메시지가 없습니다.</p>
      )}
      {messages.map((msg) => (
        <div key={msg.id} className={styles.message}>
          <div className={styles.meta}>
            <span className={styles.user}>{msg.userName}</span>
            <time className={styles.time}>
              {new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
          <p className={styles.text}>{msg.text}</p>
        </div>
      ))}
      <div ref={bottomRef} />
    </section>
  );
}
