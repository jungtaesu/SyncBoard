/**
 * app/(dashboard)/rooms/[roomId]/layout.tsx - Room Detail Layout
 *
 * @activity, @members는 parallel route slot이다.
 * URL은 하나지만 여러 독립적인 화면 조각을 동시에 렌더링할 수 있다.
 */

import { ConnectionStatus } from "@/features/issue-room/ui/ConnectionStatus";
import { LinkButton } from "@/shared/ui/Button";
import styles from "./layout.module.css";

interface Props {
  children: React.ReactNode;
  activity: React.ReactNode;
  members: React.ReactNode;
}

export default function RoomDetailLayout({ children, activity, members }: Props) {
  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <LinkButton href="/rooms" variant="ghost">
          ← 목록으로
        </LinkButton>
        <div className={styles.connection}>
          <ConnectionStatus />
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.mainColumn}>
          {children}
          {activity}
        </div>
        <div className={styles.sideColumn}>{members}</div>
      </div>
    </div>
  );
}
