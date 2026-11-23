import { authApi } from "../auth-api";
import type { DeleteRatingResponse } from "./models";

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<DeleteRatingResponse>();
}
