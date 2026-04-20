/**
 * app/(public)/layout.tsx - Public Layout
 *
 * route group `(public)`은 URL에 영향을 주지 않고 레이아웃만 분리한다.
 */

import styles from "./styles.module.css";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.logo}>IssuePulse</span>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
