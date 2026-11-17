import { queryOptions } from "@tanstack/react-query";
import { authApi } from "../auth-api";
import { type ApiResponse, unwrap } from "../response";
export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}
export async function getFavorites(signal?: AbortSignal) {
  return unwrap(await authApi.get("favorites", { signal }).json<ApiResponse<Favorite[]>>());
}
export async function getFavoriteStatus(movieId: number, signal?: AbortSignal) {
  return unwrap(
    await authApi
      .get(`favorites/${movieId}`, { signal })
      .json<ApiResponse<{ isFavorite: boolean }>>(),
  );
}
export async function addFavorite(movieId: number) {
  return unwrap(
    await authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>(),
  );
}
export async function deleteFavorite(movieId: number) {
  return unwrap(await authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>());
}
export const favoriteQueries = {
  list: (token: string | null) =>
    queryOptions({
      queryKey: ["favorites", "list"],
      queryFn: ({ signal }) => getFavorites(signal),
      enabled: Boolean(token),
      retry: false,
    }),
  status: (movieId: number, token: string | null) =>
    queryOptions({
      queryKey: ["favorites", "status", movieId],
      queryFn: ({ signal }) => getFavoriteStatus(movieId, signal),
      enabled: Boolean(token) && movieId > 0,
      retry: false,
    }),
};
