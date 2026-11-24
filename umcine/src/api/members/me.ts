import { authApi } from "../auth-api";
import type { ApiResponse } from "../common";

export interface MemberInfo {
  // 명세에 따라 내려오지 않을 수 있어서 선택값으로 두고, 없으면 토큰에서 꺼내요(getMyMemberId).
  memberId?: number;
  email: string;
  nickname: string;
  createdAt: string;
}

type MeResponse = ApiResponse<MemberInfo>;

// GET /members/me — 인증이 필요해서 authApi로 요청해요.
export async function getMe(): Promise<MemberInfo> {
  const response = await authApi.get("members/me").json<MeResponse>();
  return response.result;
}
