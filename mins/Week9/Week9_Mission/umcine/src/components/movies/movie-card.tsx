import Link from "next/link";

import type { toMovieCard } from "../../utils/movies/movie-adapter";
import { MovieImage } from "./movie-image";

type Movie = ReturnType<typeof toMovieCard>;

import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative h-[274px] w-full overflow-hidden rounded-[10px] bg-[#f6f7f9]">
        <Link className="block h-full w-full" href={`/movies/${movie.id}`}>
          <MovieImage
            className="block h-full w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <div className="absolute right-[10px] top-[10px]">
          <BookmarkButton movieId={movie.id} compact />
        </div>
      </div>

      <Link href={`/movies/${movie.id}`}>
        <h2 className="mt-[9px] truncate text-sm font-extrabold text-[#17191e]">{movie.title}</h2>
      </Link>

      <p className="mt-1 text-xs text-[#969da8]">{movie.releaseDate}</p>
    </article>
  );
}
