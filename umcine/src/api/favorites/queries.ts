import { queryOptions } from "@tanstack/react-query";
import { getFavorites, getFavoriteStatus } from "./favorites";

const favoriteKeys = {
  all: ["favorites"] as const,
  list: () => [...favoriteKeys.all, "list"] as const,
  status: (movieId: number) => [...favoriteKeys.all, "status", movieId] as const,
};

const favoriteQueries = {
  // 마이페이지 · 영화 카드가 같은 목록 캐시를 함께 써요.
  list: () =>
    queryOptions({
      queryKey: favoriteKeys.list(),
      queryFn: getFavorites,
      retry: false,
    }),

  // 영화 상세 화면에서 한 영화의 즐겨찾기 여부만 확인해요.
  status: (movieId: number) =>
    queryOptions({
      queryKey: favoriteKeys.status(movieId),
      queryFn: () => getFavoriteStatus(movieId),
      retry: false,
    }),
};

export { favoriteKeys, favoriteQueries };
