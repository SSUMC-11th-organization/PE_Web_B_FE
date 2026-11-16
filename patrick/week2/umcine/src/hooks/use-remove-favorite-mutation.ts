import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFavorite } from "@/api/favorites/remove-favorite";

export function useRemoveFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: (_response, movieId) => {
      // 이 영화는 이제 즐겨찾기가 아니에요
      queryClient.setQueryData(["favorites", "status", movieId], false);
      // 마이페이지 목록은 서버에서 다시 받아요
      queryClient.invalidateQueries({ queryKey: ["favorites", "list"] });
    },
    onError: () => {
      alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}