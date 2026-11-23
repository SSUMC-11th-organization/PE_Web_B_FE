import { authApi } from "../auth-api";
import type { RatingMutationResponse } from "./models";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  // PATCH지만 부분 수정이 아니라 전체 교체라서, 빼고 보내면 기존 후기가 지워져요.
  comment?: string;
}

export function updateRating({ ratingId, score, comment }: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: { score, comment } })
    .json<RatingMutationResponse>();
}
