import styles from "./styles.module.css";

export default function RoomsLoading() {
  return (
    <div className={styles.listPage}>
      <div className={styles.listTitleSkeleton} />
      <div className={styles.roomGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.roomCardSkeleton} />
        ))}
      </div>
    </div>
  );
}
