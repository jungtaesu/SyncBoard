/**
 * shared/websocket/event-bus.ts
 *
 * [학습 포인트]
 * raw WebSocket message를 이벤트 단위로 분배하는 경량 pub/sub 버스.
 *
 * 컴포넌트가 ws.onmessage를 직접 구독하면:
 *   - 같은 이벤트 타입을 여러 컴포넌트가 구독할 때 충돌
 *   - 언마운트 시 구독 해제 관리가 어려움
 *
 * EventBus를 쓰면:
 *   - 이벤트 타입별로 복수 리스너 등록 가능
 *   - 리스너 해제가 반환 함수 하나로 간단해짐
 */

import type { ServerEvent } from "./types";
import type { ServerEventType } from "./protocols";

type Listener<T extends ServerEvent = ServerEvent> = (event: T) => void;

class EventBus {
  private listeners = new Map<string, Set<Listener>>();

  on<T extends ServerEvent>(type: T["type"], listener: (event: T) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener as Listener);

    // 구독 해제 함수 반환 → useEffect cleanup에서 호출
    return () => this.off(type, listener as Listener);
  }

  off(type: string, listener: Listener): void {
    this.listeners.get(type)?.delete(listener);
  }

  emit(event: ServerEvent): void {
    const handlers = this.listeners.get(event.type);
    if (!handlers) return;
    for (const handler of handlers) {
      handler(event);
    }
  }

  clear(): void {
    this.listeners.clear();
  }

  /** 등록된 리스너 수 확인 (디버깅용) */
  listenerCount(type: ServerEventType): number {
    return this.listeners.get(type)?.size ?? 0;
  }
}

// 싱글턴으로 내보낸다. connection-manager가 여기에 emit한다.
export const eventBus = new EventBus();
