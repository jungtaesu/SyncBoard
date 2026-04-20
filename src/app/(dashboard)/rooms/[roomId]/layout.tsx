/**
 * app/(dashboard)/rooms/[roomId]/layout.tsx - Room Detail Layout
 *
 * @activity, @members는 parallel route slot이다.
 * URL은 하나지만 여러 독립적인 화면 조각을 동시에 렌더링할 수 있다.
 */

import { ConnectionStatus } from "@/features/issue-room/ui/ConnectionStatus";
import { LinkButton } from "@/shared/ui/Button";
import styles from "./styles.module.css";

interface Props {
  children: React.ReactNode;
  activity: React.ReactNode;
  members: React.ReactNode;
}

export default function RoomDetailLayout({ children, activity, members }: Props) {
  return (
    <div className={styles.detailShell}>
      <div className={styles.detailTopBar}>
        <LinkButton href="/rooms" variant="ghost">
          ← 목록으로
        </LinkButton>
        <div className={styles.connectionStatus}>
          <ConnectionStatus />
        </div>
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.detailMainColumn}>
          {children}
          {activity}
        </div>
        <div className={styles.detailSideColumn}>{members}</div>
      </div>
    </div>
  );
}
