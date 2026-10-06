import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-1">
      <div className="relative aspect-[241/274] overflow-hidden rounded-[10px] bg-page">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block size-full"
        >
          <img
            className="block size-full object-cover transition-transform duration-300 hover:scale-105"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <BookmarkButton
          movieId={movie.id}
          movieTitle={movie.title}
          className="absolute right-2.5 top-2.5"
        />
      </div>

      <h3 className="truncate pt-[5px] text-sm font-extrabold text-ink">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h3>
      <p className="text-xs text-ink-tertiary">{movie.releaseDate}</p>
    </article>
  );
}
