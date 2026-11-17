import { authApi } from "../auth-api";
import type { ApiResponse } from "../common";
import type { MemberInfo } from "./me";

export interface UpdateMeRequest {
  nickname: string;
}

export type UpdateMeResponse = ApiResponse<MemberInfo>;

// PATCH /members/me — 성공 응답의 result가 내 정보 조회와 같은 형태예요.
export function updateMe(body: UpdateMeRequest) {
  return authApi.patch("members/me", { json: body }).json<UpdateMeResponse>();
}
