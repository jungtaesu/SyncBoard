/**
 * RoomFilter - Client Component
 *
 * 방 목록에서 URL searchParams를 갱신하는 필터 UI다.
 * 라우트 파일보다 feature UI에 두면 목록 화면의 구조가 덜 지저분해진다.
 */

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "./RoomFilter.module.css";

export function RoomFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentStatus = searchParams?.get("status") ?? "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (e.target.value) {
      params.set("status", e.target.value);
    } else {
      params.delete("status");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={styles.filter}>
      <label htmlFor="status-filter" className={styles.label}>
        상태 필터:
      </label>
      <select
        id="status-filter"
        value={currentStatus}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="">전체</option>
        <option value="open">Open</option>
        <option value="investigating">Investigating</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>
  );
}
