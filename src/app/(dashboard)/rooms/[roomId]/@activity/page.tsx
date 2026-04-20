/**
 * app/(dashboard)/rooms/[roomId]/@activity/page.tsx — Parallel Route 슬롯
 *
 * [학습 포인트]
 * @activity는 parallel route 슬롯이다.
 * layout.tsx에서 `activity` prop으로 전달받아 동시에 렌더링된다.
 *
 * Parallel Routes의 장점:
 * - 각 슬롯은 독립적으로 로딩/에러 처리 가능
 * - URL은 하나이지만 여러 "페이지"가 동시에 렌더링됨
 * - 대시보드 레이아웃에 적합
 */

import { getRecentMessages } from "@/shared/mocks/data";

interface Props {
  params: Promise<{ roomId: string }>;
}

export default async function ActivitySlot({ params }: Props) {
  const { roomId } = await params;
  // 이 슬롯은 독립적으로 데이터를 fetch한다
  const messages = await getRecentMessages(roomId, 5);

  return (
    <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-indigo-800">
        최근 활동 <span className="text-xs font-normal text-indigo-400">(parallel route slot)</span>
      </h3>
      <ul className="flex flex-col gap-1.5">
        {messages.map((msg) => (
          <li key={msg.id} className="text-xs text-indigo-700">
            <span className="font-medium">{msg.userName}</span>: {msg.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
