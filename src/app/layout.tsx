/**
 * app/layout.tsx - Root Layout (Server Component)
 *
 * App Router의 최상위 layout.tsx는 모든 라우트에 공통 적용된다.
 * Pages Router의 _app.tsx + _document.tsx 역할을 함께 가진다.
 */

import type { Metadata } from "next";
import "./globals.css";
import { StyledComponentsRegistry } from "@/shared/ui/StyledComponentsRegistry";

export const metadata: Metadata = {
  title: "IssuePulse",
  description: "실시간 이슈룸 대시보드 - App Router + WebSocket 학습 프로젝트",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {/* styled-components SSR 스타일 주입 레지스트리 */}
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
