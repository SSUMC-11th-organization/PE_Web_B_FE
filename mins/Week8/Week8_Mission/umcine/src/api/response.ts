import { HTTPError } from "ky";

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess) throw new Error(response.message || "요청을 처리하지 못했어요.");
  return response.result;
}

export async function errorMessage(
  error: unknown,
  fallback = "요청에 실패했어요. 다시 시도해 주세요.",
) {
  if (error instanceof HTTPError) {
    // ky 2는 HTTP 오류 본문을 이미 소비하고 data에 파싱해 둔다.
    const body = error.data as { message?: string | string[] } | null | undefined;
    if (typeof body?.message === "string") return body.message;
    if (Array.isArray(body?.message)) return body.message.join(" ");
    return fallback;
  }
  return error instanceof Error && !(error instanceof TypeError) ? error.message : fallback;
}
