/**
 * app/(dashboard)/rooms/page.tsx - Room List Page (Server Component)
 *
 * App Router에서는 page.tsx가 기본적으로 Server Component다.
 * 컴포넌트 안에서 직접 데이터를 await하고, 검색 필터처럼 브라우저 상호작용이
 * 필요한 부분만 Client Component로 분리한다.
 */

import { fetchRoomList } from "@/features/issue-room/api";
import { RoomCard } from "@/features/issue-room/ui/RoomCard";
import { RoomFilter } from "@/features/issue-room/ui/RoomFilter";
import type { RoomStatus } from "@/shared/websocket/types";
import styles from "./styles.module.css";

interface SearchParams {
  status?: string;
  priority?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function RoomsPage({ searchParams }: Props) {
  const params = await searchParams;
  const rooms = await fetchRoomList({
    status: params.status as RoomStatus | undefined,
  });

  return (
    <div className={styles.listPage}>
      <div className={styles.listHeader}>
        <h1 className={styles.listTitle}>이슈 룸</h1>
        <span className={styles.listCount}>{rooms.length}개</span>
      </div>

      <RoomFilter />

      <div className={styles.roomGrid}>
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
        {rooms.length === 0 && (
          <p className={styles.emptyRooms}>조건에 맞는 룸이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
