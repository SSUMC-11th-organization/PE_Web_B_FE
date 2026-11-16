import { authApi } from "../auth-api";
import type { RatingMutationResponse } from "./models";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

export function createRating(body: CreateRatingRequest) {
  return authApi.post("ratings", { json: body }).json<RatingMutationResponse>();
}
