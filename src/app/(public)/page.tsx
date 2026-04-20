/**
 * app/(public)/page.tsx - Home Page (Server Component)
 */

import Link from "next/link";
import { LinkButton } from "@/shared/ui/Button";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>
        Issue<span>Pulse</span>
      </h1>
      <p className={styles.description}>
        App Router의 서버/클라이언트 렌더링 경계와 WebSocket 연결 설계를
        의도적으로 드러내는 실시간 이슈룸 대시보드
      </p>
      <div className={styles.actions}>
        <LinkButton href="/rooms" className={styles.actionButton}>
          App Router 버전 →
        </LinkButton>
        <Link href="/legacy/rooms/room-001" className={styles.legacyLink}>
          Pages Router 버전 →
        </Link>
      </div>
    </div>
  );
}
