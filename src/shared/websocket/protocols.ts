/**
 * shared/websocket/protocols.ts
 *
 * [학습 포인트]
 * 이벤트 이름을 상수로 고정한다.
 * string 리터럴을 코드 곳곳에 하드코딩하면 오타 추적이 어려워진다.
 */

// 클라이언트 → 서버
export const CLIENT_EVENTS = {
  JOIN_ROOM: "join_room",
  LEAVE_ROOM: "leave_room",
  SEND_MESSAGE: "send_message",
  CHANGE_STATUS: "change_status",
} as const;

// 서버 → 클라이언트
export const SERVER_EVENTS = {
  SYNC_SNAPSHOT: "sync_snapshot",
  ROOM_JOINED: "room_joined",
  ROOM_LEFT: "room_left",
  MESSAGE_RECEIVED: "message_received",
  STATUS_CHANGED: "status_changed",
  PRESENCE_UPDATED: "presence_updated",
  ERROR: "error",
} as const;

export type ClientEventType = (typeof CLIENT_EVENTS)[keyof typeof CLIENT_EVENTS];
export type ServerEventType = (typeof SERVER_EVENTS)[keyof typeof SERVER_EVENTS];
