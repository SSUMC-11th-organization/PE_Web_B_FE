import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-2.5 text-left">
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <div className="relative">
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover rounded-2xl bg-gray-200"
          />
          <BookmarkButton
            movieId={movie.id}
            className="absolute right-2 top-2"
          />
        </div>
        <h2 className="m-0 text-sm font-bold leading-[1.35]">{movie.title}</h2>
      </Link>
      <p className="m-0 text-gray-400 text-xs">{movie.releaseDate}</p>
    </article>
  );
}