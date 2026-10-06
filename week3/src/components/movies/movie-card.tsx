import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const bookmarkIcon = isBookmarked
    ? "url(/icons/movie-icons/bookmark.svg)"
    : "url(/icons/movie-icons/bookmark-outline.svg)";

  return (
    <li className="relative">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="flex flex-col gap-3"
      >
        <div className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-line">
          <img
            className="size-full object-cover"
            src={movie.posterPath}
            alt={movie.title}
            loading="lazy"
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="truncate text-[15px] font-bold text-ink">{movie.title}</p>
          <p className="text-[13px] text-ink-3">{movie.releaseDate}</p>
        </div>
      </Link>

      <button
        type="button"
        aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
        aria-pressed={isBookmarked}
        onClick={() => toggleBookmark(movie.id)}
        className={cn(
          "absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-lg bg-white/90 shadow-sm",
          isBookmarked && "bg-primary",
        )}
      >
        <span
          className={cn(
            "size-4 bg-ink [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]",
            isBookmarked && "bg-white",
          )}
          style={{ maskImage: bookmarkIcon, WebkitMaskImage: bookmarkIcon }}
        />
      </button>
    </li>
  );
}

export default MovieCard;
