/**
 * shared/websocket/types.ts
 *
 * [학습 포인트]
 * 서버↔클라이언트 메시지 계약을 타입으로 고정한다.
 * 타입 없이 raw string을 주고받으면 이벤트가 늘어날수록 추적이 불가능해진다.
 */

// ── 공통 도메인 타입 ────────────────────────────────────────

export type RoomStatus = "open" | "investigating" | "resolved";
export type RoomPriority = "low" | "medium" | "high" | "critical";

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface RoomMeta {
  id: string;
  title: string;
  status: RoomStatus;
  priority: RoomPriority;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
}

export interface RoomSnapshot {
  room: RoomMeta;
  recentEvents: RoomEvent[];
  messages: Message[];
  members: User[];
}

export interface RoomEvent {
  id: string;
  roomId: string;
  type: "status_change" | "member_join" | "member_leave" | "message" | "priority_change";
  payload: unknown;
  createdAt: string;
}

// ── 클라이언트 → 서버 이벤트 ───────────────────────────────

export type ClientEvent =
  | { type: "join_room"; roomId: string; userId: string; userName: string }
  | { type: "leave_room"; roomId: string }
  | { type: "send_message"; roomId: string; text: string }
  | { type: "change_status"; roomId: string; status: RoomStatus };

// ── 서버 → 클라이언트 이벤트 ──────────────────────────────

export type ServerEvent =
  | { type: "sync_snapshot"; room: RoomMeta; recentEvents: RoomEvent[]; messages: Message[]; members: User[] }
  | { type: "room_joined"; roomId: string; userId: string; userName: string }
  | { type: "room_left"; roomId: string; userId: string }
  | { type: "message_received"; roomId: string; message: Message }
  | { type: "status_changed"; roomId: string; status: RoomStatus; changedBy: string; changedAt: string }
  | { type: "presence_updated"; roomId: string; users: User[] }
  | { type: "error"; code: string; message: string };
