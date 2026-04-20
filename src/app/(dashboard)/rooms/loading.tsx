import styles from "./loading.module.css";

export default function RoomsLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.titleSkeleton} />
      <div className={styles.grid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.cardSkeleton} />
        ))}
      </div>
    </div>
  );
}
