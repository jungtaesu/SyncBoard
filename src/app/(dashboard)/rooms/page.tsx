/**
 * app/(dashboard)/rooms/page.tsx — 룸 목록 페이지 (Server Component)
 *
 * [학습 포인트]
 * App Router의 기본: page.tsx는 Server Component.
 * 서버에서 데이터를 fetch하고, HTML을 완성해서 클라이언트에 전송한다.
 *
 * Pages Router 비교:
 *   - Pages Router: getServerSideProps에서 데이터 fetch → props로 페이지 컴포넌트에 전달
 *   - App Router: 컴포넌트 자체가 async 함수, 내부에서 직접 await fetch
 *
 * 검색 필터(클라이언트 상호작용)만 Client Component로 분리한다.
 */

import { fetchRoomList } from "@/features/issue-room/api";
import { RoomCard } from "@/features/issue-room/ui/RoomCard";
import { RoomFilter } from "./RoomFilter";
import type { RoomStatus } from "@/shared/websocket/types";

interface SearchParams {
  status?: string;
  priority?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

// async Server Component — 내부에서 직접 데이터 fetch
export default async function RoomsPage({ searchParams }: Props) {
  const params = await searchParams;
  const rooms = await fetchRoomList({
    status: params.status as RoomStatus | undefined,
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">이슈 룸</h1>
        <span className="text-sm text-slate-400">{rooms.length}개</span>
      </div>

      {/* 검색/필터: 브라우저 상호작용이 필요 → Client Component */}
      <RoomFilter />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {rooms.map((room) => (
          // RoomCard는 Server Component: Link + 정적 렌더링
          <RoomCard key={room.id} room={room} />
        ))}
        {rooms.length === 0 && (
          <p className="col-span-2 py-12 text-center text-slate-400">조건에 맞는 룸이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
