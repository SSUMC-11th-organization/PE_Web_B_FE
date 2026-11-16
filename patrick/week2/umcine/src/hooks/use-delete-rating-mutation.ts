import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRating } from "@/api/ratings/delete-rating";

export function useDeleteRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRating,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
      alert(response.message);
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
