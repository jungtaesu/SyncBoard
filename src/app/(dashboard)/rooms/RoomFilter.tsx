/**
 * app/(dashboard)/rooms/RoomFilter.tsx — Client Component
 *
 * [학습 포인트]
 * "검색 필터만 Client Component로 분리"
 * useRouter (next/navigation) 로 URL searchParams를 갱신한다.
 * App Router에서는 useRouter를 next/navigation에서 import한다.
 * (Pages Router는 next/router에서 import — 차이점 주목)
 */

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function RoomFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentStatus = searchParams.get("status") ?? "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("status", e.target.value);
    } else {
      params.delete("status");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="status-filter" className="text-sm text-slate-500">
        상태 필터:
      </label>
      <select
        id="status-filter"
        value={currentStatus}
        onChange={handleChange}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
      >
        <option value="">전체</option>
        <option value="open">Open</option>
        <option value="investigating">Investigating</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>
  );
}
