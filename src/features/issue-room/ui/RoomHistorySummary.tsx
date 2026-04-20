/**
 * RoomHistorySummary — Server Component
 *
 * [학습 포인트]
 * 통계/요약 데이터는 자주 바뀌지 않고 SEO나 초기 렌더에 중요하다.
 * → 서버에서 렌더링하면 클라이언트 JS 없이 HTML로 전달된다.
 *
 * 이 컴포넌트가 Server Component인 이유를 말할 수 있어야 한다:
 * "상태나 이벤트 핸들러가 없고, 데이터가 서버 fetch에서 오기 때문"
 */

import type { RoomListItem } from "@/shared/mocks/data";

interface Props {
  room: RoomListItem;
}

export function RoomHistorySummary({ room }: Props) {
  const updatedAt = new Date(room.updatedAt).toLocaleString("ko-KR");

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">룸 요약</h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="text-slate-500">열린 이슈</dt>
        <dd className="font-medium text-slate-900">{room.openIssueCount}건</dd>
        <dt className="text-slate-500">참여자</dt>
        <dd className="font-medium text-slate-900">{room.memberCount}명</dd>
        <dt className="text-slate-500">마지막 업데이트</dt>
        <dd className="font-medium text-slate-900 text-xs">{updatedAt}</dd>
      </dl>
    </section>
  );
}
