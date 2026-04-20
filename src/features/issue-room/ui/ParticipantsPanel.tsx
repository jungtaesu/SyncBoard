/**
 * ParticipantsPanel - Server shell + Client island
 */

import type { User } from "@/shared/websocket/types";
import { LivePresence } from "./LivePresence";
import styles from "./ParticipantsPanel.module.css";

interface Props {
  initialMembers: User[];
}

export function ParticipantsPanel({ initialMembers }: Props) {
  return (
    <aside className={styles.panel}>
      <h3 className={styles.title}>참여자</h3>
      <LivePresence initialMembers={initialMembers} />
    </aside>
  );
}
