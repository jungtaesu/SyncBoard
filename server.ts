/**
 * server.ts — Custom Next.js 서버 + WebSocket 서버
 *
 * [학습 포인트]
 * Next.js 기본 `next dev`는 WebSocket 서버를 지원하지 않는다.
 * HTTP 서버 위에 ws(WebSocket) 서버를 올리려면 커스텀 서버가 필요하다.
 *
 * 실행: npm run dev → tsx server.ts
 */

import { createServer, IncomingMessage } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer, WebSocket } from "ws";

// ────────────────────────────────────────────────────────────
// 타입
// ────────────────────────────────────────────────────────────

interface RoomClient {
  ws: WebSocket;
  userId: string;
  userName: string;
  roomId: string;
}

// roomId → 연결된 클라이언트 목록
const rooms = new Map<string, Set<RoomClient>>();

// ────────────────────────────────────────────────────────────
// 헬퍼: 룸 브로드캐스트
// ────────────────────────────────────────────────────────────

function broadcastToRoom(roomId: string, payload: unknown, exclude?: WebSocket) {
  const clients = rooms.get(roomId);
  if (!clients) return;
  const data = JSON.stringify(payload);
  for (const client of clients) {
    if (client.ws !== exclude && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(data);
    }
  }
}

function getRoomMembers(roomId: string) {
  const clients = rooms.get(roomId);
  if (!clients) return [];
  return [...clients].map((c) => ({ id: c.userId, name: c.userName }));
}

// ────────────────────────────────────────────────────────────
// WebSocket 연결 핸들러
// ────────────────────────────────────────────────────────────

function handleConnection(ws: WebSocket) {
  let currentClient: RoomClient | null = null;

  // heartbeat 처리
  (ws as WebSocket & { isAlive: boolean }).isAlive = true;
  ws.on("pong", () => {
    (ws as WebSocket & { isAlive: boolean }).isAlive = true;
  });

  ws.on("message", (raw) => {
    let msg: unknown;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      ws.send(JSON.stringify({ type: "error", code: "PARSE_ERROR", message: "Invalid JSON" }));
      return;
    }

    if (typeof msg !== "object" || msg === null || !("type" in msg)) {
      ws.send(JSON.stringify({ type: "error", code: "INVALID_MSG", message: "Missing type field" }));
      return;
    }

    const event = msg as Record<string, unknown>;

    switch (event.type) {
      // ── 룸 입장 ──────────────────────────────────────────
      case "join_room": {
        const roomId = String(event.roomId);
        const userId = String(event.userId ?? `user_${Date.now()}`);
        const userName = String(event.userName ?? "Anonymous");

        // 이전 룸에서 퇴장
        if (currentClient) {
          leaveRoom(currentClient);
        }

        if (!rooms.has(roomId)) rooms.set(roomId, new Set());
        currentClient = { ws, userId, userName, roomId };
        rooms.get(roomId)!.add(currentClient);

        // 1) 현재 클라이언트에게 snapshot 전송
        const snapshot = buildSnapshot(roomId, userId);
        ws.send(JSON.stringify({ type: "sync_snapshot", ...snapshot }));

        // 2) 룸 전체에 presence 업데이트 브로드캐스트
        broadcastToRoom(roomId, {
          type: "presence_updated",
          roomId,
          users: getRoomMembers(roomId),
        });

        // 3) 다른 참여자에게 입장 알림
        broadcastToRoom(
          roomId,
          { type: "room_joined", roomId, userId, userName },
          ws,
        );
        break;
      }

      // ── 룸 퇴장 ──────────────────────────────────────────
      case "leave_room": {
        if (currentClient) {
          leaveRoom(currentClient);
          currentClient = null;
        }
        break;
      }

      // ── 메시지 전송 ──────────────────────────────────────
      case "send_message": {
        if (!currentClient) {
          ws.send(JSON.stringify({ type: "error", code: "NOT_IN_ROOM", message: "Join a room first" }));
          return;
        }
        const message = {
          id: `msg_${Date.now()}`,
          roomId: currentClient.roomId,
          userId: currentClient.userId,
          userName: currentClient.userName,
          text: String(event.text ?? ""),
          createdAt: new Date().toISOString(),
        };
        broadcastToRoom(currentClient.roomId, { type: "message_received", roomId: currentClient.roomId, message });
        break;
      }

      // ── 상태 변경 ─────────────────────────────────────────
      case "change_status": {
        if (!currentClient) return;
        const status = event.status as string;
        broadcastToRoom(currentClient.roomId, {
          type: "status_changed",
          roomId: currentClient.roomId,
          status,
          changedBy: currentClient.userId,
          changedAt: new Date().toISOString(),
        });
        break;
      }

      default:
        ws.send(JSON.stringify({ type: "error", code: "UNKNOWN_TYPE", message: `Unknown event: ${event.type}` }));
    }
  });

  ws.on("close", () => {
    if (currentClient) leaveRoom(currentClient);
  });
}

function leaveRoom(client: RoomClient) {
  const set = rooms.get(client.roomId);
  if (!set) return;
  set.delete(client);
  if (set.size === 0) rooms.delete(client.roomId);

  broadcastToRoom(client.roomId, {
    type: "room_left",
    roomId: client.roomId,
    userId: client.userId,
  });
  broadcastToRoom(client.roomId, {
    type: "presence_updated",
    roomId: client.roomId,
    users: getRoomMembers(client.roomId),
  });
}

// ────────────────────────────────────────────────────────────
// 초기 Snapshot 생성 (mock)
// ────────────────────────────────────────────────────────────

function buildSnapshot(roomId: string, _userId: string) {
  return {
    room: {
      id: roomId,
      title: `Room ${roomId}`,
      status: "open",
      priority: "high",
      createdAt: new Date(Date.now() - 3_600_000).toISOString(),
      updatedAt: new Date().toISOString(),
      memberCount: rooms.get(roomId)?.size ?? 0,
    },
    recentEvents: [],
    messages: [],
    members: getRoomMembers(roomId),
  };
}

// ────────────────────────────────────────────────────────────
// Heartbeat: 연결이 끊긴 클라이언트 정리
// ────────────────────────────────────────────────────────────

function startHeartbeat(wss: WebSocketServer) {
  setInterval(() => {
    wss.clients.forEach((ws) => {
      const socket = ws as WebSocket & { isAlive: boolean };
      if (!socket.isAlive) {
        socket.terminate();
        return;
      }
      socket.isAlive = false;
      socket.ping();
    });
  }, 30_000);
}

// ────────────────────────────────────────────────────────────
// 서버 부트스트랩
// ────────────────────────────────────────────────────────────

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT ?? "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url ?? "/", true);
    handle(req, res, parsedUrl);
  });

  // WebSocket 서버를 HTTP 서버에 붙임 (/ws 경로만 upgrade 처리)
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (req: IncomingMessage, socket, head) => {
    const { pathname } = parse(req.url ?? "/");
    if (pathname === "/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", handleConnection);
  startHeartbeat(wss);

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port} (mode: ${dev ? "dev" : "prod"})`);
    console.log(`> WebSocket server listening on ws://${hostname}:${port}/ws`);
  });
});
