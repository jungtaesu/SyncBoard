import styles from "./loading.module.css";

export default function RoomDetailLoading() {
  return (
    <div className={styles.stack}>
      <div className={styles.header} />
      <div className={styles.actions} />
      <div className={styles.panel} />
    </div>
  );
}
