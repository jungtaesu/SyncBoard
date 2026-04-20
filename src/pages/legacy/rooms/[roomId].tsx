/**
 * pages/legacy/rooms/[roomId].tsx — Pages Router 버전 룸 상세
 *
 * ════════════════════════════════════════════════════════════
 * [핵심 비교] App Router vs Pages Router
 * ════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────┬──────────────────────────────────────┬──────────────────────────────────────┐
 * │                     │ App Router (app/rooms/[roomId])       │ Pages Router (이 파일)                 │
 * ├─────────────────────┼──────────────────────────────────────┼──────────────────────────────────────┤
 * │ 기본 컴포넌트        │ Server Component                      │ 클라이언트 컴포넌트 (브라우저에서 실행) │
 * │ 데이터 fetch        │ async 컴포넌트 내부에서 직접 await     │ getServerSideProps 별도 함수          │
 * │ 레이아웃            │ layout.tsx (중첩, 세그먼트별)          │ _app.tsx or 페이지별 래핑              │
 * │ 로딩 UI             │ loading.tsx (자동 Suspense)           │ 직접 useState로 관리                  │
 * │ 에러 처리           │ error.tsx (자동 Error Boundary)       │ try/catch or Error Boundary 수동 추가 │
 * │ WebSocket           │ 클라이언트 island (RoomSocketProvider) │ 페이지 전체가 클라이언트, useEffect   │
 * │ 서버/클라이언트 분리 │ 명시적 경계 ('use client')            │ 경계 없음, 전부 클라이언트             │
 * │ useRouter import    │ next/navigation                       │ next/router                           │
 * └─────────────────────┴──────────────────────────────────────┴──────────────────────────────────────┘
 *
 * Pages Router에서 WebSocket을 붙이면:
 * - 컴포넌트 전체가 클라이언트 → 서버/클라이언트 경계가 없음
 * - 초기 데이터는 getServerSideProps에서 가져오지만
 *   WebSocket 연결은 useEffect에서 시작 → 구조가 페이지 단위로 몰림
 * - 레이아웃 재사용을 위해 _app.tsx or HOC 패턴이 필요
 */

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";   // Pages Router: next/router (App Router: next/navigation)
import type { GetServerSideProps } from "next";
import type { RoomMeta, Message, User, RoomStatus, ServerEvent } from "@/shared/websocket/types";
import { serialize } from "@/shared/websocket/serializers";
import { deserialize } from "@/shared/websocket/serializers";

// ── getServerSideProps: Pages Router의 서버 데이터 fetch ────
// App Router 비교: async Server Component 내부에서 await fetch()
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const roomId = ctx.params?.roomId as string;

  // 동적 import로 서버 전용 mock 함수 사용
  const { fetchRoomSnapshot } = await import("@/features/issue-room/api");
  const snapshot = await fetchRoomSnapshot(roomId);

  if (!snapshot) return { notFound: true };

  return {
    props: {
      roomId,
      initialRoom: snapshot.room,
      initialMessages: snapshot.messages,
      initialMembers: snapshot.members,
    },
  };
};

// ── 페이지 컴포넌트 Props ────────────────────────────────────

interface Props {
  roomId: string;
  initialRoom: RoomMeta;
  initialMessages: Message[];
  initialMembers: User[];
}

// ── 페이지 컴포넌트 ──────────────────────────────────────────
// Pages Router에서는 이 컴포넌트 전체가 클라이언트에서 실행된다.
// App Router처럼 서버/클라이언트를 컴포넌트 단위로 나눌 수 없다.

export default function LegacyRoomPage({
  roomId,
  initialRoom,
  initialMessages,
  initialMembers,
}: Props) {
  const router = useRouter(); // next/router ← Pages Router

  // ── 상태 관리 ─────────────────────────────────────────────
  // App Router 비교: Zustand 스토어에서 관리
  // Pages Router: 여기선 페이지 로컬 useState로 관리
  const [room, setRoom] = useState<RoomMeta>(initialRoom);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [members, setMembers] = useState<User[]>(initialMembers);
  const [wsStatus, setWsStatus] = useState<"connecting" | "open" | "closed">("connecting");
  const [inputText, setInputText] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const userId = useRef(`user_${Math.random().toString(36).slice(2, 8)}`);

  // ── WebSocket 연결 ────────────────────────────────────────
  // App Router 비교: useRoomSocket 훅 + connection-manager 레이어
  // Pages Router: useEffect 내에서 직접 WebSocket 생성
  // → WebSocket 로직이 컴포넌트 안에 인라인으로 들어오는 경향
  useEffect(() => {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3000/ws"
    );
    wsRef.current = ws;

    ws.onopen = () => {
      setWsStatus("open");
      ws.send(
        serialize({
          type: "join_room",
          roomId,
          userId: userId.current,
          userName: "Legacy User",
        })
      );
    };

    ws.onmessage = (ev: MessageEvent<string>) => {
      const event = deserialize(ev.data) as ServerEvent | null;
      if (!event) return;

      // App Router 비교: eventBus.emit() → 각 구독자가 처리
      // Pages Router: switch-case가 여기 컴포넌트에 직접 위치
      switch (event.type) {
        case "sync_snapshot":
          setRoom(event.room);
          setMessages(event.messages);
          setMembers(event.members as User[]);
          break;
        case "message_received":
          setMessages((prev) => [...prev, event.message]);
          break;
        case "presence_updated":
          setMembers(event.users as User[]);
          break;
        case "status_changed":
          setRoom((prev) => ({ ...prev, status: event.status as RoomStatus }));
          break;
      }
    };

    ws.onclose = () => setWsStatus("closed");

    return () => {
      ws.send(serialize({ type: "leave_room", roomId }));
      ws.close(1000);
    };
  }, [roomId]);

  // ── 메시지 전송 ───────────────────────────────────────────

  function sendMessage() {
    if (!inputText.trim() || wsRef.current?.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(serialize({ type: "send_message", roomId, text: inputText.trim() }));
    setInputText("");
  }

  // ── 렌더링 ────────────────────────────────────────────────
  // App Router 비교: 컴포넌트를 Server/Client로 분리해서 조합
  // Pages Router: 모든 것이 이 컴포넌트 안에서 렌더링됨

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* 비교 배너 */}
      <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
        <strong>Pages Router 버전</strong> — 이 컴포넌트 전체가 클라이언트에서 실행됩니다.
        서버/클라이언트 경계가 없고, WebSocket 로직이 페이지에 인라인으로 위치합니다.
        <button onClick={() => router.push(`/rooms/${roomId}`)} className="ml-3 underline">
          App Router 버전 보기 →
        </button>
      </div>

      {/* 헤더 */}
      <div className="border-b border-slate-200 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{room.title}</h1>
          <span className="text-sm font-semibold text-slate-500">[{room.status}]</span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
          <span>우선순위: {room.priority}</span>
          <span
            className={`font-medium ${
              wsStatus === "open"
                ? "text-green-600"
                : wsStatus === "connecting"
                ? "text-yellow-600"
                : "text-red-500"
            }`}
          >
            WS: {wsStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 메시지 영역 */}
        <div className="col-span-2 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-700">메시지</h3>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-80">
            {messages.map((msg) => (
              <div key={msg.id} className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs font-semibold text-slate-700">{msg.userName}</span>
                <p className="text-sm text-slate-800">{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2 border-t border-slate-200">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={wsStatus !== "open"}
              placeholder={wsStatus === "open" ? "메시지 입력…" : "연결 중…"}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 disabled:bg-slate-50"
            />
            <button
              onClick={sendMessage}
              disabled={wsStatus !== "open" || !inputText.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              전송
            </button>
          </div>
        </div>

        {/* 멤버 영역 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">참여자</h3>
          <ul className="flex flex-col gap-2">
            {members.map((u) => (
              <li key={u.id} className="flex items-center gap-2 text-sm">
                <span className="h-7 w-7 flex items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                  {u.name[0]}
                </span>
                {u.name}
              </li>
            ))}
            {members.length === 0 && (
              <li className="text-xs text-slate-400">참여자 없음</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
