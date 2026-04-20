/**
 * app/(dashboard)/rooms/loading.tsx
 *
 * [학습 포인트]
 * loading.tsx는 Suspense 경계를 자동으로 만든다.
 * 서버가 데이터를 fetch하는 동안 이 UI를 즉시 스트리밍해서 보여준다.
 * 별도의 <Suspense> 감싸기 없이 파일 컨벤션만으로 동작한다.
 *
 * Next.js 공식: loading.js는 서버에서 즉시 로딩 UI를 보여주고,
 * 이후 컨텐츠가 스트리밍되어 교체되는 흐름을 지원한다.
 */

export default function RoomsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 h-8 w-40 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
