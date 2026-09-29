import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  const bookmarkIcon = movie.isBookmarked
    ? "url(/icons/movie-icons/bookmark.svg)"
    : "url(/icons/movie-icons/bookmark-outline.svg)";

  return (
    <li>
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="flex flex-col gap-3"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-line">
          <img
            className="size-full object-cover"
            src={movie.posterPath}
            alt={movie.title}
            loading="lazy"
          />
          <span
            className={cn(
              "absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-lg bg-white/90 shadow-sm",
              movie.isBookmarked && "bg-primary",
            )}
          >
            <span
              className={cn(
                "size-4 bg-ink [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]",
                movie.isBookmarked && "bg-white",
              )}
              style={{ maskImage: bookmarkIcon, WebkitMaskImage: bookmarkIcon }}
            />
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <p className="truncate text-[15px] font-bold text-ink">{movie.title}</p>
          <p className="text-[13px] text-ink-3">{movie.releaseDate}</p>
        </div>
      </Link>
    </li>
  );
}

export default MovieCard;
