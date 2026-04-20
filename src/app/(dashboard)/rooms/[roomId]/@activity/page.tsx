/**
 * app/(dashboard)/rooms/[roomId]/@activity/page.tsx - Parallel Route Slot
 */

import { getRecentMessages } from "@/shared/mocks/data";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ roomId: string }>;
}

export default async function ActivitySlot({ params }: Props) {
  const { roomId } = await params;
  const messages = await getRecentMessages(roomId, 5);

  return (
    <section className={styles.panel}>
      <h3 className={styles.title}>
        최근 활동 <span>(parallel route slot)</span>
      </h3>
      <ul className={styles.list}>
        {messages.map((msg) => (
          <li key={msg.id} className={styles.item}>
            <span>{msg.userName}</span>: {msg.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
