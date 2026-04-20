/**
 * app/(dashboard)/rooms/[roomId]/error.tsx - Room Detail Error Boundary
 */

"use client";

import { Button, LinkButton } from "@/shared/ui/Button";
import styles from "./styles.module.css";

export default function RoomDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.detailErrorPanel}>
      <p className={styles.detailErrorIcon}>!</p>
      <h2 className={styles.detailErrorTitle}>룸을 불러오지 못했습니다</h2>
      <p className={styles.detailErrorMessage}>{error.message}</p>
      <div className={styles.detailErrorActions}>
        <Button onClick={reset}>다시 시도</Button>
        <LinkButton href="/rooms" variant="secondary">
          목록으로
        </LinkButton>
      </div>
    </div>
  );
}
