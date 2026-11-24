import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  type Rating,
  type RatingInput,
  updateRating,
} from "../api/ratings/ratings";
import { errorMessage } from "../api/response";
import { useAuthStore } from "../stores/auth-store";

type RatingAction =
  | { type: "create"; body: RatingInput & { movieId: number } }
  | { type: "update"; ratingId: number; body: RatingInput }
  | { type: "delete"; ratingId: number };
export function useRatingMutation(memberId: number | null) {
  const client = useQueryClient();
  const token = useAuthStore((state) => state.accessToken);
  return useMutation({
    mutationFn: async (action: RatingAction) => {
      if (action.type === "delete") {
        await deleteRating(action.ratingId);
        return { deletedId: action.ratingId, rating: null };
      }
      const rating =
        action.type === "create"
          ? await createRating(action.body)
          : await updateRating(action.ratingId, action.body);
      return { deletedId: null, rating };
    },
    onSuccess: (result) => {
      if (useAuthStore.getState().accessToken !== token) return;
      client.setQueryData<Rating[]>(["ratings", "member", memberId], (previous = []) => {
        if (result.rating)
          return [
            result.rating,
            ...previous.filter((rating) => rating.ratingId !== result.rating.ratingId),
          ];
        return previous.filter((rating) => rating.ratingId !== result.deletedId);
      });
    },
    onError: async (error) => {
      window.alert(await errorMessage(error, "평점 요청에 실패했어요. 다시 시도해 주세요."));
      if (useAuthStore.getState().accessToken === token)
        await client.invalidateQueries({ queryKey: ["ratings", "member", memberId] });
    },
  });
}
