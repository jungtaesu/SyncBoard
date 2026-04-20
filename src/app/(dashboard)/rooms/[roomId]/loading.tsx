/**
 * app/(dashboard)/rooms/[roomId]/loading.tsx
 *
 * 룸 상세 세그먼트의 로딩 UI.
 * 상위 rooms/loading.tsx와 별개로 동작한다 → 세그먼트 단위 UX 제어.
 */

export default function RoomDetailLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-20 animate-pulse rounded-xl bg-slate-200" />
      <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
      <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}
