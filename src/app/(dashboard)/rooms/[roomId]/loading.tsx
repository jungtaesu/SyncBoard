import styles from "./styles.module.css";

export default function RoomDetailLoading() {
  return (
    <div className={styles.detailLoadingStack}>
      <div className={styles.detailHeaderSkeleton} />
      <div className={styles.detailActionsSkeleton} />
      <div className={styles.detailPanelSkeleton} />
    </div>
  );
}
