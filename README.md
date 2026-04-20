# IssuePulse

**App Router의 렌더링 모델과 WebSocket 계층을 의도적으로 드러내는 실시간 이슈룸 대시보드**

---

## 실행

```bash
npm install
npm run dev        # tsx server.ts → http://localhost:3000
```

---

## 폴더 구조

```
src/
├── app/                           # App Router
│   ├── layout.tsx                 # Root Layout (html/body)
│   ├── (public)/                  # route group: 랜딩 페이지
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── (dashboard)/
│       └── rooms/
│           ├── loading.tsx        # 자동 Suspense → 스켈레톤 UI
│           ├── error.tsx          # 자동 Error Boundary
│           ├── page.tsx           # Server Component: 룸 목록
│           ├── RoomFilter.tsx     # Client Component: 검색 필터
│           └── [roomId]/
│               ├── layout.tsx     # Parallel Routes 슬롯 배치
│               ├── loading.tsx    # 세그먼트 단위 로딩 UI
│               ├── error.tsx      # 세그먼트 단위 에러 처리
│               ├── page.tsx       # Server+Client 혼합: 룸 상세
│               ├── @activity/     # Parallel Route 슬롯
│               ├── @members/      # Parallel Route 슬롯
│               ├── metrics/[metricId]/page.tsx  # 실제 메트릭 페이지
│               └── (.)metrics/[metricId]/       # Intercepting Route → 모달
│
├── pages/                         # Pages Router (비교용)
│   ├── _app.tsx
│   └── legacy/rooms/[roomId].tsx  # getServerSideProps + 클라이언트 WS
│
├── features/issue-room/
│   ├── api/          # 서버 컴포넌트용 fetch 함수
│   ├── hooks/        # useRoomSocket
│   └── ui/           # RoomCard, RoomHeader, ActivityFeed, ...
│
└── shared/
    ├── websocket/
    │   ├── types.ts              # ClientEvent / ServerEvent 타입
    │   ├── protocols.ts          # 이벤트 이름 상수
    │   ├── serializers.ts        # serialize / deserialize
    │   ├── event-bus.ts          # 이벤트 타입별 pub/sub
    │   ├── client.ts             # WebSocket 저수준 래퍼
    │   └── connection-manager.ts # 재연결, 룸 subscribe
    └── stores/
        ├── socket-store.ts       # 연결 상태 (Zustand)
        └── room-store.ts         # 룸 실시간 상태 (Zustand)
```

---

## 핵심 학습 포인트

| 질문 | 확인할 파일 |
|------|------------|
| App Router에서 서버/클라이언트 경계는 어디서 나뉘는가? | `rooms/[roomId]/page.tsx` |
| Pages Router에서 같은 화면은 어떻게 다른가? | `pages/legacy/rooms/[roomId].tsx` |
| WebSocket 계층을 어떻게 모듈화했는가? | `shared/websocket/` |
| `loading.tsx`가 실제로 어떤 UX를 만드는가? | `rooms/loading.tsx`, `[roomId]/loading.tsx` |
| Parallel Routes는 무엇을 독립적으로 만드는가? | `[roomId]/layout.tsx`, `@activity/`, `@members/` |
| Intercepting Route + 모달 패턴이란? | `(.)metrics/[metricId]/page.tsx` |
| 초기 snapshot과 실시간 delta를 어디서 합치는가? | `features/issue-room/hooks/use-room-socket.ts` |