import { apiClient } from "../api-client";
import { type ApiResponse, unwrap } from "../response";
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResult {
  nickname: string;
  accessToken: string;
}
export async function login(body: LoginRequest) {
  const result = unwrap(
    await apiClient.post("auth/login", { json: body }).json<ApiResponse<LoginResult>>(),
  );
  if (!result?.accessToken) throw new Error("로그인 응답에 토큰이 없어요.");
  return result;
}
