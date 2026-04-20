/**
 * RoomSocketProvider — Client Component
 *
 * [학습 포인트]
 * useRoomSocket 훅을 컴포넌트 트리에 주입하는 provider 패턴.
 * 룸 상세 페이지의 최상단 Client Component로, 내부에 Server Component 자식을 포함할 수 있다.
 *
 * "use client 경계를 최대한 내려서 bundle 크기를 줄인다"는 원칙에 따라,
 * 이 컴포넌트는 오직 WebSocket 연결 로직만 담당한다.
 */

"use client";

import { useRoomSocket } from "../hooks/use-room-socket";
import type { RoomMeta, Message, User } from "@/shared/websocket/types";

interface Props {
  roomId: string;
  initialSnapshot: {
    room: RoomMeta;
    messages: Message[];
    members: User[];
  };
  children: React.ReactNode;
}

export function RoomSocketProvider({ roomId, initialSnapshot, children }: Props) {
  useRoomSocket(roomId, { initialSnapshot });
  // children에는 Server/Client 컴포넌트가 혼합될 수 있다
  return <>{children}</>;
}
