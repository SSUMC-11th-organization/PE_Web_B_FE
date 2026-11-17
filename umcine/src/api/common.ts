// 우리 백엔드의 공통 응답 형태예요.
interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

function isApiResponse(data: unknown): data is ApiResponse<unknown> {
  return typeof data === "object" && data !== null && "result" in data && "isSuccess" in data;
}

// { isSuccess, code, message, result } 형태면 result만 꺼내고, 아니면 그대로 돌려줘요.
// 일부 API(평점 목록 등)는 감싸지 않은 배열을 돌려주던 이전 구현과도 호환돼요.
function unwrapResult<T>(data: unknown): T {
  return (isApiResponse(data) ? data.result : data) as T;
}

export { unwrapResult, type ApiResponse };
