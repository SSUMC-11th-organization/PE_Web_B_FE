import { apiClient } from "../api-client";
import { type ApiResponse, unwrap } from "../response";
export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}
export async function signup(body: SignupRequest) {
  const response = await apiClient
    .post("members", { json: body })
    .json<ApiResponse<{ memberId: number; email: string; nickname: string }>>();
  unwrap(response);
  return response;
}
