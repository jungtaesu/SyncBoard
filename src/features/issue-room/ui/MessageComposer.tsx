/**
 * MessageComposer - Client Component
 *
 * styled-components 비교 예제.
 * 입력 상태, submit 핸들러, WebSocket 전송이 있으므로 원래부터 Client Component다.
 */

"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import styled from "styled-components";
import { send } from "@/shared/websocket/connection-manager";
import { useRoomStore } from "@/shared/stores/room-store";
import { useSocketStore } from "@/shared/stores/socket-store";

export function MessageComposer() {
  const [text, setText] = useState("");
  const roomId = useRoomStore((s) => s.roomId);
  const socketStatus = useSocketStore((s) => s.status);
  const isConnected = socketStatus === "open";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || !roomId) return;

    const sent = send({ type: "send_message", roomId, text: text.trim() });
    if (sent) setText("");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={text}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
        disabled={!isConnected}
        placeholder={isConnected ? "메시지를 입력하세요" : "연결 중..."}
      />
      <SendButton type="submit" disabled={!isConnected || !text.trim()}>
        전송
      </SendButton>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  gap: 8px;
  border-top: 1px solid #e2e8f0;
  padding-top: 12px;
`;

const Input = styled.input`
  flex: 1;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 12px;
  color: #0f172a;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #818cf8;
  }

  &:disabled {
    background: #f8fafc;
    color: #94a3b8;
  }
`;

const SendButton = styled.button`
  border: 0;
  border-radius: 8px;
  background: #4f46e5;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: #4338ca;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
