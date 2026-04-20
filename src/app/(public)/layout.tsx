/**
 * app/(public)/layout.tsx — Public 레이아웃
 *
 * [학습 포인트]
 * route group `(public)`: 괄호로 묶어서 URL에 영향 없이 레이아웃만 분리.
 * /rooms 와 / 가 서로 다른 레이아웃을 쓰려면 route group이 필요하다.
 *
 * Next.js 공식: route group은 URL 변경 없이 폴더 구조를 정리하는 용도.
 */

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <span className="text-lg font-bold text-indigo-600">IssuePulse</span>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
