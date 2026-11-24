import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite, deleteFavorite } from "../api/favorites/favorites";
import { errorMessage } from "../api/response";
import { useAuthStore } from "../stores/auth-store";
export function useFavoriteMutation() {
  const client = useQueryClient();
  const token = useAuthStore((state) => state.accessToken);
  return useMutation({
    mutationKey: ["favorites", "change"],
    mutationFn: async ({ movieId, isFavorite }: { movieId: number; isFavorite: boolean }) => {
      if (isFavorite) await deleteFavorite(movieId);
      else await addFavorite(movieId);
      return { movieId, isFavorite: !isFavorite };
    },
    onSuccess: async (result) => {
      if (useAuthStore.getState().accessToken !== token) return;
      client.setQueryData(["favorites", "status", result.movieId], {
        isFavorite: result.isFavorite,
      });
      await client.invalidateQueries({ queryKey: ["favorites", "list"] });
    },
    onError: async (error, variables) => {
      window.alert(await errorMessage(error, "즐겨찾기를 변경하지 못했어요."));
      if (useAuthStore.getState().accessToken !== token) return;
      await Promise.all([
        client.invalidateQueries({ queryKey: ["favorites", "list"] }),
        client.invalidateQueries({ queryKey: ["favorites", "status", variables.movieId] }),
      ]);
    },
  });
}
