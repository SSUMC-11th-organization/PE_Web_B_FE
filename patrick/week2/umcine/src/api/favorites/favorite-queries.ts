import { queryOptions } from "@tanstack/react-query";
import { getFavoriteStatus } from "./get-favorite-status";
import { getFavorites } from "./get-favorites";

export const favoriteQueries = {
  list: () =>
    queryOptions({
      queryKey: ["favorites", "list"],
      queryFn: getFavorites,
    }),
  status: (movieId: number) =>
    queryOptions({
      queryKey: ["favorites", "status", movieId],
      queryFn: () => getFavoriteStatus(movieId),
    }),
};