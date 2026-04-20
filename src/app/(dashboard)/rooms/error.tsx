/**
 * app/(dashboard)/rooms/error.tsx
 *
 * error.tsx는 Error Boundary이므로 반드시 Client Component다.
 */

"use client";

import { Button } from "@/shared/ui/Button";
import styles from "./error.module.css";

export default function RoomsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.panel}>
      <p className={styles.icon}>!</p>
      <h2 className={styles.title}>룸 목록을 불러오지 못했습니다</h2>
      <p className={styles.message}>{error.message}</p>
      <Button onClick={reset} className={styles.retry}>
        다시 시도
      </Button>
    </div>
  );
}
