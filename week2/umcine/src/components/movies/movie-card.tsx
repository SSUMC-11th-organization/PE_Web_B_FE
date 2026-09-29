import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex flex-col">
      <div className="relative aspect-2/3 overflow-hidden rounded-[10px]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block size-full"
        >
          <img
            className="block size-full object-cover transition-transform duration-300 hover:scale-105"
            src={movie.posterPath}
            alt={movie.title}
          />
        </Link>

        <button
          type="button"
          className={cn(
            "absolute right-2 top-2 flex size-8 cursor-pointer items-center justify-center rounded-full p-2 text-white transition-colors",
            movie.isBookmarked ? "bg-blue-600" : "bg-black/60",
          )}
          aria-pressed={movie.isBookmarked}
          aria-label={`${movie.title} 북마크`}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="size-5 brightness-0 invert"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <h3 className="mt-3 mb-1 truncate text-[15px] font-semibold text-[#1a1a1a]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h3>
      <p className="text-[13px] text-[#9a9a9a]">{movie.releaseDate}</p>
    </article>
  );
}
