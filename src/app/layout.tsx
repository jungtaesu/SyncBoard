/**
 * app/layout.tsx — Root Layout (Server Component)
 *
 * [학습 포인트]
 * App Router의 최상위 layout.tsx는 모든 라우트에 공통 적용된다.
 * - <html>, <body> 태그를 여기서 정의한다
 * - Pages Router의 _app.tsx + _document.tsx 역할을 통합한 것
 *
 * 이 파일은 Server Component이므로 useState 등 사용 불가.
 * 전역 상태가 필요한 Provider는 별도 Client Component로 분리한다.
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IssuePulse",
  description: "실시간 이슈룸 대시보드 — App Router + WebSocket 학습 프로젝트",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
