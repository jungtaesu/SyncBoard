/**
 * StatusActionBar - Client Component
 *
 * styled-components 비교 예제.
 * 클릭 이벤트와 optimistic UI가 있으므로 Client Component로 유지한다.
 */

"use client";

import styled, { css } from "styled-components";
import { useRoomStore } from "@/shared/stores/room-store";
import { useSocketStore } from "@/shared/stores/socket-store";
import { send } from "@/shared/websocket/connection-manager";
import type { RoomStatus } from "@/shared/websocket/types";

type StatusTone = "danger" | "warning" | "success";

const STATUS_OPTIONS: { value: RoomStatus; label: string; tone: StatusTone }[] = [
  { value: "open", label: "Open", tone: "danger" },
  { value: "investigating", label: "Investigating", tone: "warning" },
  { value: "resolved", label: "Resolved", tone: "success" },
];

export function StatusActionBar() {
  const roomId = useRoomStore((s) => s.roomId);
  const currentStatus = useRoomStore((s) => s.status);
  const setRoomStatus = useRoomStore((s) => s.setRoomStatus);
  const socketStatus = useSocketStore((s) => s.status);
  const isConnected = socketStatus === "open";

  function handleStatusChange(status: RoomStatus) {
    if (!roomId || status === currentStatus) return;

    setRoomStatus(status);
    send({ type: "change_status", roomId, status });
  }

  return (
    <Bar>
      <Label>상태 변경:</Label>
      {STATUS_OPTIONS.map((opt) => (
        <StatusButton
          key={opt.value}
          type="button"
          onClick={() => handleStatusChange(opt.value)}
          disabled={!isConnected || currentStatus === opt.value}
          $active={currentStatus === opt.value}
          $tone={opt.tone}
        >
          {opt.label}
          {currentStatus === opt.value && " ✓"}
        </StatusButton>
      ))}
    </Bar>
  );
}

const TONE_STYLE = {
  danger: css`
    background: #fee2e2;
    color: #b91c1c;

    &:hover:not(:disabled) {
      background: #fecaca;
    }
  `,
  warning: css`
    background: #fef3c7;
    color: #a16207;

    &:hover:not(:disabled) {
      background: #fde68a;
    }
  `,
  success: css`
    background: #dcfce7;
    color: #15803d;

    &:hover:not(:disabled) {
      background: #bbf7d0;
    }
  `,
};

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
`;

const Label = styled.span`
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
`;

const StatusButton = styled.button<{ $active: boolean; $tone: StatusTone }>`
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  transition:
    background 0.15s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease;
  ${({ $tone }) => TONE_STYLE[$tone]}

  ${({ $active }) =>
    $active &&
    css`
      box-shadow: 0 0 0 2px currentColor;
    `}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;
