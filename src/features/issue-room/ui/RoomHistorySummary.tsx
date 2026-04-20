/**
 * RoomHistorySummary - Server Component
 */

import type { RoomListItem } from "@/shared/mocks/data";
import styles from "./RoomHistorySummary.module.css";

interface Props {
  room: RoomListItem;
}

export function RoomHistorySummary({ room }: Props) {
  const updatedAt = new Date(room.updatedAt).toLocaleString("ko-KR");

  return (
    <section className={styles.panel}>
      <h3 className={styles.title}>룸 요약</h3>
      <dl className={styles.list}>
        <dt>열린 이슈</dt>
        <dd>{room.openIssueCount}건</dd>
        <dt>참여자</dt>
        <dd>{room.memberCount}명</dd>
        <dt>마지막 업데이트</dt>
        <dd className={styles.compact}>{updatedAt}</dd>
      </dl>
    </section>
  );
}
