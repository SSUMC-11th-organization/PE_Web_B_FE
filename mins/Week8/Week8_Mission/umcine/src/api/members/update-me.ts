import { authApi } from "../auth-api";
import { type ApiResponse, unwrap } from "../response";
import type { MemberInfo } from "./me";
export async function updateMe(body: { nickname: string }) {
  return unwrap(await authApi.patch("members/me", { json: body }).json<ApiResponse<MemberInfo>>());
}
