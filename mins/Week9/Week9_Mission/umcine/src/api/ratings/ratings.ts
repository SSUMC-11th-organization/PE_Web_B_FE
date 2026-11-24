import { queryOptions } from "@tanstack/react-query";
import { authApi } from "../auth-api";
import { type ApiResponse, unwrap } from "../response";
export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface RatingInput {
  score: number;
  comment: string;
}
export async function getRatings(memberId: number, signal?: AbortSignal) {
  return authApi.get(`members/${memberId}/ratings`, { signal }).json<Rating[]>();
}
export async function createRating(body: RatingInput & { movieId: number }) {
  return unwrap(await authApi.post("ratings", { json: body }).json<ApiResponse<Rating>>());
}
export async function updateRating(ratingId: number, body: RatingInput) {
  return unwrap(
    await authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<Rating>>(),
  );
}
export async function deleteRating(ratingId: number) {
  return unwrap(await authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>());
}
export const ratingQueries = {
  member: (memberId: number | null, token: string | null) =>
    queryOptions({
      queryKey: ["ratings", "member", memberId],
      queryFn: ({ signal }) => getRatings(memberId as number, signal),
      enabled: Boolean(token) && memberId !== null,
      retry: false,
    }),
};
