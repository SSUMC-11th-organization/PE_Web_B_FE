import { authApi } from "../auth-api";

interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string | null;
}

interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment: string | null;
}

// POST /ratings
function createRating(body: CreateRatingRequest) {
  return authApi.post("ratings", { json: body }).json<unknown>();
}

// PATCH /ratings/{ratingId} — ratingId는 주소에, 나머지는 본문에 담아요.
function updateRating({ ratingId, ...body }: UpdateRatingRequest) {
  return authApi.patch(`ratings/${ratingId}`, { json: body }).json<unknown>();
}

// DELETE /ratings/{ratingId}
async function deleteRating(ratingId: number) {
  await authApi.delete(`ratings/${ratingId}`);
}

export {
  createRating,
  deleteRating,
  updateRating,
  type CreateRatingRequest,
  type UpdateRatingRequest,
};
