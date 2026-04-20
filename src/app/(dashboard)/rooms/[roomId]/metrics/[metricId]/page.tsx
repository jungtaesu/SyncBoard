/**
 * app/(dashboard)/rooms/[roomId]/metrics/[metricId]/page.tsx
 *
 * Intercepting route가 아닌 실제 metrics 페이지다.
 * 새로고침이나 직접 URL 접근 시 이 페이지가 렌더링된다.
 */

import { getRoomMetrics } from "@/features/issue-room/api";
import { LinkButton } from "@/shared/ui/Button";
import styles from "./styles.module.css";

interface Props {
  params: Promise<{ roomId: string; metricId: string }>;
}

export default async function MetricPage({ params }: Props) {
  const { roomId, metricId } = await params;
  const metric = await getRoomMetrics(roomId, metricId);

  return (
    <div className={styles.page}>
      <LinkButton href={`/rooms/${roomId}`} variant="ghost">
        ← 룸으로 돌아가기
      </LinkButton>
      <h1 className={styles.title}>{metric.label}</h1>
      <p className={styles.room}>Room: {roomId}</p>

      <div className={styles.card}>
        <div className={styles.valueRow}>
          <span className={styles.value}>{metric.value}</span>
          <span className={metric.trend === "up" ? styles.trendUp : styles.trendDown}>
            {metric.trend === "up" ? "↑" : "↓"}
          </span>
        </div>
        <p className={styles.note}>
          새로고침하면 모달이 아니라 이 실제 페이지가 렌더링된다.
        </p>
      </div>
    </div>
  );
}
