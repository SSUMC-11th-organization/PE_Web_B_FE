import { useIsMutating, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { favoriteQueries } from "../api/favorites/favorites";
import { useFavoriteMutation } from "../hooks/use-favorite-mutation";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

export function BookmarkButton({
  movieId,
  compact = false,
  detail = false,
}: {
  movieId: number;
  compact?: boolean;
  detail?: boolean;
}) {
  const token = useAuthStore((state) => state.accessToken);
  const favorites = useQuery(favoriteQueries.list(detail ? null : token));
  const status = useQuery(favoriteQueries.status(movieId, detail ? token : null));
  const query = detail ? status : favorites;
  const mutation = useFavoriteMutation();
  const changing =
    useIsMutating({
      mutationKey: ["favorites", "change"],
      predicate: (item) =>
        (item.state.variables as { movieId?: number } | undefined)?.movieId === movieId,
    }) > 0;
  const isFavorite = detail
    ? Boolean(status.data?.isFavorite)
    : Boolean(favorites.data?.some((favorite) => favorite.movieId === movieId));
  const navigate = useNavigate();
  const busy = changing || Boolean(token && query.isLoading);
  const label = busy
    ? "처리 중"
    : token && query.isError
      ? "즐겨찾기 다시 확인"
      : isFavorite
        ? "즐겨찾기 해제"
        : "즐겨찾기 추가";
  return (
    <button
      type="button"
      disabled={busy}
      aria-pressed={isFavorite}
      aria-label={compact ? `영화 ${movieId} ${label}` : label}
      className={cn(
        compact
          ? "flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-white"
          : "inline-flex items-center justify-center gap-1 self-start rounded-lg px-3 py-2 text-xs font-extrabold",
        "cursor-pointer text-white disabled:cursor-wait disabled:opacity-50",
        isFavorite ? "bg-[#17191e]" : "bg-[#2563eb]",
      )}
      onClick={() => {
        if (!token) {
          void navigate({ to: "/login" });
          return;
        }
        if (query.isError) {
          void query.refetch();
          return;
        }
        if (busy) return;
        mutation.mutate({ movieId, isFavorite });
      }}
    >
      <img
        className={cn("brightness-0 invert", compact ? "h-6 w-6" : "h-4 w-4")}
        src={isFavorite ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
      />
      {!compact && label}
    </button>
  );
}
