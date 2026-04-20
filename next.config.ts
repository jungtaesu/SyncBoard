import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pages 디렉터리와 app 디렉터리를 함께 사용 (App Router + Pages Router 병행)
  // Next.js 15 기준으로는 기본 활성화됨
  experimental: {
    // 병렬 라우트, 인터셉트 라우트 등 App Router 기능은 별도 플래그 불필요
  },
};

export default nextConfig;
