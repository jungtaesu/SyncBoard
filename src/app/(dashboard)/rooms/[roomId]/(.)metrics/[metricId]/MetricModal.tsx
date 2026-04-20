/**
 * MetricModal - Client Component
 *
 * Intercepting Route로 띄우는 모달이다.
 * router.back()과 click handler가 있으므로 Client Component다.
 */

"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import styled from "styled-components";

interface Metric {
  id: string;
  roomId: string;
  label: string;
  value: string;
  trend: "up" | "down";
  updatedAt: string;
  history: { t: string; v: number }[];
}

interface Props {
  metric: Metric;
}

export function MetricModal({ metric }: Props) {
  const router = useRouter();

  return (
    <Backdrop onClick={() => router.back()}>
      <Panel onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <CloseButton onClick={() => router.back()} aria-label="닫기">
          ×
        </CloseButton>

        <Title>{metric.label}</Title>
        <UpdatedAt>
          업데이트:{" "}
          {new Date(metric.updatedAt).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </UpdatedAt>

        <ValueRow>
          <Value>{metric.value}</Value>
          <Trend $trend={metric.trend}>{metric.trend === "up" ? "↑" : "↓"}</Trend>
        </ValueRow>

        <ChartBlock>
          <ChartTitle>최근 10개 포인트</ChartTitle>
          <Bars>
            {metric.history.map((point, i) => (
              <Bar
                key={i}
                $height={Math.max(4, (point.v / 20) * 100)}
                title={`${point.v.toFixed(1)}`}
              />
            ))}
          </Bars>
        </ChartBlock>

        <RouteNote>
          URL: /rooms/{metric.roomId}/metrics/{metric.id}
          <br />
          intercepting route: 룸 상세를 유지하면서 모달로 렌더링
        </RouteNote>
      </Panel>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.4);
  backdrop-filter: blur(4px);
`;

const Panel = styled.div`
  position: relative;
  width: min(100% - 32px, 448px);
  border-radius: 16px;
  background: #ffffff;
  padding: 24px;
  box-shadow: 0 24px 48px rgb(15 23 42 / 0.24);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  border: 0;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;

  &:hover {
    color: #334155;
  }
`;

const Title = styled.h2`
  color: #0f172a;
  font-size: 20px;
  font-weight: 700;
`;

const UpdatedAt = styled.p`
  margin-top: 4px;
  color: #94a3b8;
  font-size: 14px;
`;

const ValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
`;

const Value = styled.span`
  color: #0f172a;
  font-size: 36px;
  font-weight: 800;
`;

const Trend = styled.span<{ $trend: "up" | "down" }>`
  color: ${({ $trend }) => ($trend === "up" ? "#ef4444" : "#22c55e")};
  font-size: 24px;
`;

const ChartBlock = styled.div`
  margin-top: 24px;
`;

const ChartTitle = styled.p`
  margin-bottom: 8px;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
`;

const Bars = styled.div`
  display: flex;
  height: 64px;
  align-items: flex-end;
  gap: 4px;
`;

const Bar = styled.div<{ $height: number }>`
  flex: 1;
  height: ${({ $height }) => $height}%;
  border-radius: 4px 4px 0 0;
  background: #818cf8;
`;

const RouteNote = styled.p`
  margin-top: 16px;
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.5;
`;
