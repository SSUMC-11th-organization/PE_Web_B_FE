import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "@/api/favorites/add-favorite";

export function useAddFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    onSuccess: (_response, movieId) => {
      // 이 영화는 이제 즐겨찾기 상태예요
      queryClient.setQueryData(["favorites", "status", movieId], true);
      // 마이페이지 목록은 서버에서 다시 받아요
      queryClient.invalidateQueries({ queryKey: ["favorites", "list"] });
    },
    onError: () => {
      alert("즐겨찾기 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}