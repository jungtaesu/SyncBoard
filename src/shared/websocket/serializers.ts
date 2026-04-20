/**
 * shared/websocket/serializers.ts
 *
 * [학습 포인트]
 * 직렬화/역직렬화를 한 곳에 모은다.
 * 서버 응답 형식이 바뀌어도 이 파일만 수정하면 된다.
 */

import type { ClientEvent, ServerEvent } from "./types";

export function serialize(event: ClientEvent): string {
  return JSON.stringify(event);
}

/**
 * raw 메시지를 ServerEvent 타입으로 파싱한다.
 * 파싱 실패 시 null 반환 → 호출부에서 무시하거나 로깅한다.
 */
export function deserialize(raw: string): ServerEvent | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "type" in parsed &&
      typeof (parsed as Record<string, unknown>).type === "string"
    ) {
      return parsed as ServerEvent;
    }
    return null;
  } catch {
    return null;
  }
}
