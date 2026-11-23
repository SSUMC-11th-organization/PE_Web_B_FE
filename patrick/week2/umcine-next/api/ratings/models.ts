import type { RatingResponse } from "../members/models";

interface RatingMutationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RatingResponse;
}

interface DeleteRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
}

export type { DeleteRatingResponse, RatingMutationResponse };
