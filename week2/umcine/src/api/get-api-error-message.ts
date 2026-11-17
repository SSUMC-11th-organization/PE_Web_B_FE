import { isHTTPError } from "ky";

// 서버가 내려준 실패 메시지가 있으면 그 메시지를, 없으면 기본 문구를 보여줘요.
export function getApiErrorMessage(error: unknown, fallback: string) {
    if (isHTTPError(error)) {
        const data = error.data;
        if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
            return data.message;
        }
    }
    return fallback;
}
