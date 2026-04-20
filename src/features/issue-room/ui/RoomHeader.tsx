/**
 * RoomHeader - Server Component
 *
 * 초기 snapshot에서 온 정적 정보를 보여준다.
 */

import type { RoomMeta } from "@/shared/websocket/types";
import styles from "./RoomHeader.module.css";

const STATUS_CLASS: Record<string, string> = {
  open: styles.open,
  investigating: styles.investigating,
  resolved: styles.resolved,
};

interface Props {
  room: RoomMeta;
}

export function RoomHeader({ room }: Props) {
  const created = new Date(room.createdAt).toLocaleString("ko-KR");

  return (
    <div className={styles.header}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{room.title}</h1>
        <span className={`${styles.status} ${STATUS_CLASS[room.status] ?? ""}`}>
          [{room.status}]
        </span>
      </div>
      <p className={styles.meta}>
        생성: {created} · 우선순위: <strong>{room.priority}</strong>
      </p>
    </div>
  );
}
