/**
 * ConnectionStatus - Client Component
 *
 * WebSocket 연결 상태를 표시한다.
 */

"use client";

import styled, { css, keyframes } from "styled-components";
import { useSocketStore, type SocketStatus } from "@/shared/stores/socket-store";

const STATUS_CONFIG: Record<SocketStatus, { label: string; color: string; dot: string; pulse?: boolean }> = {
  idle: { label: "대기", color: "#64748b", dot: "#cbd5e1" },
  connecting: { label: "연결 중...", color: "#2563eb", dot: "#60a5fa", pulse: true },
  open: { label: "연결됨", color: "#15803d", dot: "#4ade80" },
  closed: { label: "연결 끊김", color: "#64748b", dot: "#94a3b8" },
  reconnecting: { label: "재연결 중...", color: "#ca8a04", dot: "#facc15", pulse: true },
  failed: { label: "연결 실패", color: "#dc2626", dot: "#ef4444" },
};

export function ConnectionStatus() {
  const status = useSocketStore((s) => s.status);
  const reconnectAttempts = useSocketStore((s) => s.reconnectAttempts);
  const cfg = STATUS_CONFIG[status];

  return (
    <StatusText $color={cfg.color}>
      <Dot $color={cfg.dot} $pulse={Boolean(cfg.pulse)} />
      {cfg.label}
      {status === "reconnecting" && reconnectAttempts > 0 && (
        <Attempts>({reconnectAttempts}번째)</Attempts>
      )}
    </StatusText>
  );
}

const pulse = keyframes`
  50% {
    opacity: 0.35;
  }
`;

const StatusText = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 500;
`;

const Dot = styled.span<{ $color: string; $pulse: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  ${({ $pulse }) =>
    $pulse &&
    css`
      animation: ${pulse} 1.2s ease-in-out infinite;
    `}
`;

const Attempts = styled.span`
  color: #94a3b8;
`;
