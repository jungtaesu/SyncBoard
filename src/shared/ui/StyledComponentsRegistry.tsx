"use client";

/**
 * shared/ui/StyledComponentsRegistry.tsx
 *
 * [학습 포인트]
 * App Router에서 styled-components가 SSR 시 스타일을 주입하려면
 * ServerStyleSheet + useServerInsertedHTML 조합이 필요하다.
 *
 * compiler.styledComponents: true (SWC 트랜스폼)만으로는 충분하지 않다.
 * SWC 트랜스폼은 className 생성 방식을 최적화하지만,
 * 실제 스타일 주입(SSR flush)은 이 레지스트리가 담당한다.
 *
 * 참고: https://nextjs.org/docs/app/guides/css/css-in-js#styled-components
 */

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [sheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    // 동일 스타일이 중복 주입되지 않도록 태그를 비운다
    sheet.instance.clearTag();
    return <>{styles}</>;
  });

  // 클라이언트에서는 StyleSheetManager 없이 children을 그대로 렌더링
  if (typeof window !== "undefined") return <>{children}</>;

  return (
    <StyleSheetManager sheet={sheet.instance}>
      {children as React.ReactElement}
    </StyleSheetManager>
  );
}
