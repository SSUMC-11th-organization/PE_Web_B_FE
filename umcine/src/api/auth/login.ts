import { backendClient } from "../backend-client";
import type { ApiResponse } from "../common";

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = ApiResponse<{
  nickname: string;
  accessToken: string;
}>;

// POST /auth/login — 인증이 필요 없는 요청이라 backendClient로 보내요.
export function login(body: LoginRequest) {
  return backendClient.post("auth/login", { json: body }).json<LoginResponse>();
}
