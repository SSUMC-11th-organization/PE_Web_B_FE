import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-2.5 text-left">
      <Link to = "/movies/$movieId" params ={{ movieId: String(movie.id)}} >
        <div className = "relative">
          <img
          src={movie.posterPath}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover rounded-2xl bg-gray-200"
          />
           <button
            type="button"
             className={cn(
              "absolute right-2 top-2 rounded-full p-2 text-white",
               movie.isBookmarked ? "bg-blue-600" : "bg-black/60",
              )}
            onClick={() => onToggleBookmark(movie.id)}
            aria-pressed={movie.isBookmarked}
           aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          >
        <img
          src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
          alt=""
          className="h-4 w-4"
        />
      </button>
        </div>
        <h2 className="m-0 text-sm font-bold leading-[1.35]">{movie.title}</h2>
        </Link>
      <p className="m-0 text-gray-400 text-xs">{movie.releaseDate}</p>
      </article>
  );
}
