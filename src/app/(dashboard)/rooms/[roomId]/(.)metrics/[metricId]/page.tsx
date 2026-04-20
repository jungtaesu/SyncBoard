/**
 * app/(dashboard)/rooms/[roomId]/(.)metrics/[metricId]/page.tsx — Intercepting Route
 *
 * [학습 포인트]
 * `(.)metrics`는 같은 레벨에서 /metrics/[metricId] 경로를 가로챈다.
 *
 * 동작:
 *   - 룸 상세 페이지 내에서 메트릭 링크 클릭 → 이 파일이 모달로 렌더링
 *   - URL은 /rooms/room-001/metrics/error-rate 로 변경되지만 페이지는 유지됨
 *   - 새로고침/직접 URL 입력 → intercepting 없이 실제 metrics/page.tsx가 렌더링
 *
 * 이 패턴이 만드는 UX:
 *   - URL이 있는 모달 (공유 가능, 뒤로가기 가능)
 *   - 모달 위에서 새로고침해도 올바른 페이지로 이동
 */

import { getRoomMetrics } from "@/features/issue-room/api";
import { MetricModal } from "./MetricModal";

interface Props {
  params: Promise<{ roomId: string; metricId: string }>;
}

export default async function MetricInterceptedPage({ params }: Props) {
  const { roomId, metricId } = await params;
  const metric = await getRoomMetrics(roomId, metricId);

  return <MetricModal metric={metric} />;
}
