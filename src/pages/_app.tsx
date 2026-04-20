/**
 * pages/_app.tsx — Pages Router 진입점
 *
 * [학습 포인트 - Pages Router vs App Router]
 * Pages Router에서 _app.tsx는:
 *   - 모든 페이지의 공통 wrapper
 *   - 전역 CSS import
 *   - 전역 레이아웃/Provider 위치
 *
 * App Router에서는 이 역할이 app/layout.tsx로 대체된다.
 * 차이점:
 *   - _app.tsx: 클라이언트 중심, 페이지 단위 컴포넌트 트리
 *   - layout.tsx: 서버 기본, 중첩 가능, 세그먼트별 레이아웃 분리 가능
 */

import type { AppProps } from "next/app";
import "@/app/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <span className="text-lg font-bold text-indigo-600">IssuePulse</span>
        <span className="ml-2 text-xs text-slate-400">(Pages Router 버전)</span>
      </header>
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
