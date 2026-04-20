/**
 * RoomCard - Server Component
 *
 * 브라우저 상태나 이벤트 핸들러가 없으므로 Server Component로 유지한다.
 */

import Link from "next/link";
import type { RoomListItem } from "@/shared/mocks/data";
import styles from "./RoomCard.module.css";

const STATUS_CLASS: Record<string, string> = {
  open: styles.statusOpen,
  investigating: styles.statusInvestigating,
  resolved: styles.statusResolved,
};

const PRIORITY_CLASS: Record<string, string> = {
  low: styles.priorityLow,
  medium: styles.priorityMedium,
  high: styles.priorityHigh,
  critical: styles.priorityCritical,
};

interface Props {
  room: RoomListItem;
}

export function RoomCard({ room }: Props) {
  const lastEvent = new Date(room.lastEventAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/rooms/${room.id}`} className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{room.title}</h2>
        <span className={`${styles.statusBadge} ${STATUS_CLASS[room.status] ?? ""}`}>
          {room.status}
        </span>
      </div>

      <p className={styles.description}>{room.description}</p>

      <div className={styles.meta}>
        <span className={`${styles.priorityBadge} ${PRIORITY_CLASS[room.priority] ?? ""}`}>
          {room.priority}
        </span>
        <span>이슈 {room.openIssueCount}건</span>
        <span>참여자 {room.memberCount}명</span>
        <span className={styles.lastEvent}>최근 이벤트 {lastEvent}</span>
      </div>
    </Link>
  );
}
