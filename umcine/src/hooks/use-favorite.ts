import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Favorite } from "../api/favorites/favorites";
import { favoriteKeys, favoriteQueries } from "../api/favorites/queries";
import { favoriteMutations } from "../api/mutations";
import { useAuthStore } from "../stores/auth-store";

// source가 "status"면 GET /favorites/{movieId}(상세 화면), "list"면 GET /favorites 목록 캐시(카드)로 확인해요.
// 카드가 20개여도 목록 요청은 한 번만 가요.
export function useIsFavorite(movieId: number, source: "status" | "list") {
  const isLoggedIn = useAuthStore((state) => Boolean(state.accessToken));

  const statusQuery = useQuery({
    ...favoriteQueries.status(movieId),
    enabled: isLoggedIn && source === "status",
  });
  const listQuery = useQuery({
    ...favoriteQueries.list(),
    enabled: isLoggedIn && source === "list",
    select: (favorites) => favorites.some((favorite) => favorite.movieId === movieId),
  });

  const query = source === "status" ? statusQuery : listQuery;
  return { isFavorite: isLoggedIn && query.data === true, isLoading: query.isLoading };
}

// 선택 심화: 낙관적 업데이트 — 응답을 기다리지 않고 아이콘을 먼저 바꾸고, 실패하면 되돌려요.
export function useToggleFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();
  const statusKey = favoriteKeys.status(movieId);
  const listKey = favoriteKeys.list();

  return useMutation({
    ...favoriteMutations.toggle(movieId),
    onMutate: async (nextIsFavorite) => {
      // 진행 중인 조회가 끝나며 낙관적으로 바꾼 값을 덮어쓰지 않도록 취소해요.
      await queryClient.cancelQueries({ queryKey: favoriteKeys.all });

      const prevStatus = queryClient.getQueryData<boolean>(statusKey);
      const prevList = queryClient.getQueryData<Favorite[]>(listKey);

      queryClient.setQueryData<boolean>(statusKey, nextIsFavorite);
      if (prevList) {
        queryClient.setQueryData<Favorite[]>(
          listKey,
          nextIsFavorite
            ? [{ movieId }, ...prevList]
            : prevList.filter((favorite) => favorite.movieId !== movieId),
        );
      }
      return { prevStatus, prevList };
    },
    onError: (_error, _nextIsFavorite, context) => {
      // 요청이 실패하면 바꾸기 전 값으로 되돌려요.
      if (context?.prevStatus !== undefined) queryClient.setQueryData(statusKey, context.prevStatus);
      else queryClient.removeQueries({ queryKey: statusKey });
      if (context?.prevList) queryClient.setQueryData(listKey, context.prevList);
      alert("즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.");
    },
    onSettled: () => {
      // 성공 · 실패와 관계없이 서버 값과 맞추기 위해 즐겨찾기 캐시를 무효화해요.
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });
}
