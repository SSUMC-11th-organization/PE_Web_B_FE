import { authApi } from "../auth-api";
import { unwrapResult } from "../common";
import type { MemberRating } from "./models";

type GetMemberRatingsResponse = MemberRating[];

// GET /members/{memberId}/ratings — 최신순, 없는 회원이면 404
async function getMemberRatings(memberId: number): Promise<GetMemberRatingsResponse> {
  const data = await authApi.get(`members/${memberId}/ratings`).json<unknown>();
  return unwrapResult<GetMemberRatingsResponse>(data) ?? [];
}

export { getMemberRatings, type GetMemberRatingsResponse };
