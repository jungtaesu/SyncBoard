/**
 * LivePresence - Client Component
 *
 * ParticipantsPanel(Server)의 자식 Client island.
 */

"use client";

import { useRoomStore } from "@/shared/stores/room-store";
import type { User } from "@/shared/websocket/types";
import styles from "./LivePresence.module.css";

interface Props {
  initialMembers: User[];
}

export function LivePresence({ initialMembers }: Props) {
  const liveMembers = useRoomStore((s) => s.members);
  const members = liveMembers.length > 0 ? liveMembers : initialMembers;

  return (
    <ul className={styles.list}>
      {members.map((user) => (
        <li key={user.id} className={styles.item}>
          <span className={styles.avatar}>{user.name[0].toUpperCase()}</span>
          {user.name}
          <span className={styles.onlineDot} aria-label="온라인" />
        </li>
      ))}
      {members.length === 0 && (
        <li className={styles.empty}>현재 참여자 없음</li>
      )}
    </ul>
  );
}
