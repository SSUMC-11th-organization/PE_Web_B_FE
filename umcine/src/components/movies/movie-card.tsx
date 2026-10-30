import { Link } from '@tanstack/react-router'
import type { MovieCardItem } from '../../types/movie'
import BookmarkButton from './bookmark-button'
import MoviePoster from './movie-poster'

interface MovieCardProps {
  movie: MovieCardItem
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="relative">
      <Link
        className="group flex flex-col gap-1"
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
      >
        <MoviePoster
          className="h-[274px] w-full rounded-[10px]"
          imageClassName="transition-transform duration-300 group-hover:scale-105"
          src={movie.posterUrl}
          alt={movie.title}
        />
        <h3 className="mt-[5px] truncate text-sm leading-none font-extrabold text-text-primary">
          {movie.title}
        </h3>
        <p className="text-xs font-normal text-text-tertiary">{movie.releaseDate}</p>
      </Link>
      {/* 버튼을 링크 안에 넣지 않도록 카드 위에 겹쳐 배치해요. */}
      <BookmarkButton className="absolute top-2 right-2" movieId={movie.id} />
    </article>
  )
}

export default MovieCard
