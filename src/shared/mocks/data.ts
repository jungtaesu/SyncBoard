/**
 * shared/mocks/data.ts
 *
 * 서버(SSR/RSC)에서 사용하는 mock 데이터.
 * 실제 프로젝트라면 DB 쿼리나 외부 API 호출로 교체된다.
 */

import type { RoomMeta, RoomStatus, RoomPriority, Message, User } from "@/shared/websocket/types";

export interface RoomListItem extends RoomMeta {
  openIssueCount: number;
  lastEventAt: string;
  description: string;
}

const ROOMS: RoomListItem[] = [
  {
    id: "room-001",
    title: "Payment Gateway Outage",
    description: "카드 결제 실패율 급증. Stripe 측 장애 연동 여부 확인 중",
    status: "investigating" as RoomStatus,
    priority: "critical" as RoomPriority,
    createdAt: new Date(Date.now() - 7_200_000).toISOString(),
    updatedAt: new Date(Date.now() - 300_000).toISOString(),
    memberCount: 5,
    openIssueCount: 3,
    lastEventAt: new Date(Date.now() - 60_000).toISOString(),
  },
  {
    id: "room-002",
    title: "API Latency P99 > 3s",
    description: "검색 API latency 이상 증가. DB slow query 분석 중",
    status: "open" as RoomStatus,
    priority: "high" as RoomPriority,
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
    updatedAt: new Date(Date.now() - 900_000).toISOString(),
    memberCount: 3,
    openIssueCount: 1,
    lastEventAt: new Date(Date.now() - 120_000).toISOString(),
  },
  {
    id: "room-003",
    title: "CDN Cache Miss Spike",
    description: "이미지 CDN 캐시 히트율 70% → 12% 급락",
    status: "resolved" as RoomStatus,
    priority: "medium" as RoomPriority,
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 1_800_000).toISOString(),
    memberCount: 2,
    openIssueCount: 0,
    lastEventAt: new Date(Date.now() - 1_800_000).toISOString(),
  },
];

/** 룸 목록 조회 (서버 fetch 시뮬레이션) */
export async function getRooms(
  filter?: { status?: RoomStatus; priority?: RoomPriority },
): Promise<RoomListItem[]> {
  // 실제 프로젝트라면 await db.query(...) 등
  await new Promise((r) => setTimeout(r, 200)); // 네트워크 지연 시뮬레이션

  return ROOMS.filter((room) => {
    if (filter?.status && room.status !== filter.status) return false;
    if (filter?.priority && room.priority !== filter.priority) return false;
    return true;
  });
}

/** 룸 상세 조회 (서버 fetch) */
export async function getRoomById(roomId: string): Promise<RoomListItem | null> {
  await new Promise((r) => setTimeout(r, 100));
  return ROOMS.find((r) => r.id === roomId) ?? null;
}

/** 최근 메시지 조회 (서버 fetch) */
export async function getRecentMessages(roomId: string, limit = 20): Promise<Message[]> {
  await new Promise((r) => setTimeout(r, 100));

  const messages: Message[] = Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
    id: `msg_${roomId}_${i}`,
    roomId,
    userId: `user_${i % 3}`,
    userName: ["Alice", "Bob", "Carol"][i % 3],
    text: [
      "Stripe status page 확인했는데 별도 공지 없음",
      "결제 실패 로그 S3 올렸어요",
      "fallback PG로 전환할까요?",
      "DB team에 연락했습니다",
      "현재 실패율 12.3%",
    ][i],
    createdAt: new Date(Date.now() - (5 - i) * 300_000).toISOString(),
  }));

  return messages;
}

/** 현재 참여자 조회 (서버 fetch) */
export async function getRoomMembers(roomId: string): Promise<User[]> {
  await new Promise((r) => setTimeout(r, 80));

  const memberMap: Record<string, User[]> = {
    "room-001": [
      { id: "user_0", name: "Alice" },
      { id: "user_1", name: "Bob" },
    ],
    "room-002": [{ id: "user_2", name: "Carol" }],
    "room-003": [],
  };
  return memberMap[roomId] ?? [];
}

/** 룸 메트릭 조회 (모달용) */
export async function getRoomMetrics(roomId: string, metricId: string) {
  await new Promise((r) => setTimeout(r, 150));
  return {
    id: metricId,
    roomId,
    label: metricId === "error-rate" ? "Error Rate" : "Latency P99",
    value: metricId === "error-rate" ? "12.3%" : "3.1s",
    trend: "up" as const,
    updatedAt: new Date().toISOString(),
    history: Array.from({ length: 10 }, (_, i) => ({
      t: new Date(Date.now() - (9 - i) * 600_000).toISOString(),
      v: Math.random() * 20,
    })),
  };
}
