"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { favoriteQueries } from "@/api/favorites/favorite-queries";
import { useAddFavoriteMutation } from "@/hooks/use-add-favorite-mutation";
import { useRemoveFavoriteMutation } from "@/hooks/use-remove-favorite-mutation";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/utils/cn";

interface FavoriteButtonProps {
  movieId: number;
  className?: string;
}

export function FavoriteButton({ movieId, className }: FavoriteButtonProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 로그인했을 때만 이 영화의 즐겨찾기 여부를 조회해요
  const statusQuery = useQuery({
    ...favoriteQueries.status(movieId),
    enabled: Boolean(accessToken),
  });
  const addMutation = useAddFavoriteMutation();
  const removeMutation = useRemoveFavoriteMutation();

  const isFavorite = statusQuery.data === true;
  const isPending = addMutation.isPending || removeMutation.isPending;

  const handleClick = () => {
    // 로그인하지 않았다면 로그인 화면으로 보내요
    if (!accessToken) {
      alert("로그인이 필요해요.");
      router.push("/login");
      return;
    }
    if (statusQuery.isPending || isPending) return;

    if (isFavorite) {
      removeMutation.mutate(movieId);
    } else {
      addMutation.mutate(movieId);
    }
  };

  return (
    <button
      type="button"
      className={cn(
        "rounded-full p-2 text-white",
        isFavorite ? "bg-blue-600" : "bg-black/60",
        className,
      )}
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
    >
      <img
        src={isFavorite ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        className="h-4 w-4"
      />
    </button>
  );
}
