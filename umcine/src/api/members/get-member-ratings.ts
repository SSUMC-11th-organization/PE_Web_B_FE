import { backendClient } from "../backend-client";
import type { MemberRating } from "./models";

type GetMemberRatingsResponse = MemberRating[];

// GET /members/{memberId}/ratings — 최신순, 없는 회원이면 404
function getMemberRatings(memberId: number) {
  return backendClient.get(`members/${memberId}/ratings`).json<GetMemberRatingsResponse>();
}

export { getMemberRatings, type GetMemberRatingsResponse };
