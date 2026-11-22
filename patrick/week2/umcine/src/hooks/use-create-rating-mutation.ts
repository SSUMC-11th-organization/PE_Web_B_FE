import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "@/api/ratings/create-rating";

export function useCreateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRating,
    onSuccess: (response) => {
      // 평점 목록이 바뀌었으니 서버에서 다시 받아요
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
      alert(response.message);
    },
    onError: () => {
      alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
