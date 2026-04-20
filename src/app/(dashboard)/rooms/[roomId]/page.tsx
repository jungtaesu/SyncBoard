/**
 * app/(dashboard)/rooms/[roomId]/page.tsx - Room Detail Page
 *
 * 핵심 패턴: "초기 snapshot은 서버, 이후 delta는 WebSocket".
 * 이 파일은 Server Component로 남기고, RoomSocketProvider만 Client island로 둔다.
 */

import { notFound } from "next/navigation";
import { fetchRoomSnapshot } from "@/features/issue-room/api";
import { RoomHeader } from "@/features/issue-room/ui/RoomHeader";
import { RoomHistorySummary } from "@/features/issue-room/ui/RoomHistorySummary";
import { StatusActionBar } from "@/features/issue-room/ui/StatusActionBar";
import { ActivityFeed } from "@/features/issue-room/ui/ActivityFeed";
import { MessageComposer } from "@/features/issue-room/ui/MessageComposer";
import { RoomSocketProvider } from "@/features/issue-room/ui/RoomSocketProvider";
import { LinkButton } from "@/shared/ui/Button";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ roomId: string }>;
}

export default async function RoomDetailPage({ params }: Props) {
  const { roomId } = await params;
  const snapshot = await fetchRoomSnapshot(roomId);

  if (!snapshot) notFound();

  const { room, messages, members } = snapshot;

  return (
    <RoomSocketProvider roomId={roomId} initialSnapshot={{ room, messages, members }}>
      <div className={styles.content}>
        <RoomHeader room={room} />
        <StatusActionBar />

        <div className={styles.metricLinks}>
          <LinkButton href={`/rooms/${roomId}/metrics/error-rate`} variant="secondary" className={styles.metricLink}>
            Error Rate
          </LinkButton>
          <LinkButton href={`/rooms/${roomId}/metrics/latency-p99`} variant="secondary" className={styles.metricLink}>
            Latency P99
          </LinkButton>
        </div>

        <section className={styles.messagePanel}>
          <h3 className={styles.messageTitle}>메시지</h3>
          <ActivityFeed />
          <MessageComposer />
        </section>

        <RoomHistorySummary
          room={{ ...room, openIssueCount: 0, lastEventAt: room.updatedAt, description: "" }}
        />
      </div>
    </RoomSocketProvider>
  );
}
