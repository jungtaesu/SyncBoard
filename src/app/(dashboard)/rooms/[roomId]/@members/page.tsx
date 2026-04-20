/**
 * app/(dashboard)/rooms/[roomId]/@members/page.tsx — Parallel Route 슬롯
 *
 * [학습 포인트]
 * @members 슬롯은 ParticipantsPanel을 독립적으로 렌더링한다.
 * 이 슬롯이 에러가 나도 나머지 슬롯과 page.tsx에는 영향이 없다.
 */

import { getRoomMembers } from "@/shared/mocks/data";
import { ParticipantsPanel } from "@/features/issue-room/ui/ParticipantsPanel";

interface Props {
  params: Promise<{ roomId: string }>;
}

export default async function MembersSlot({ params }: Props) {
  const { roomId } = await params;
  const members = await getRoomMembers(roomId);

  return <ParticipantsPanel initialMembers={members} />;
}
