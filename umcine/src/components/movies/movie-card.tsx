import { Link } from '@tanstack/react-router'
import type { Movie } from '../../types/movie'
import { cn } from '../../utils/cn'

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (id: number) => void
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="relative">
      <Link
        className="group flex flex-col gap-1"
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
      >
        <div className="h-[274px] w-full overflow-hidden rounded-[10px] bg-border-default">
          <img
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={movie.posterPath}
            alt={movie.title}
          />
        </div>
        <h3 className="mt-[5px] truncate text-sm leading-none font-extrabold text-text-primary">
          {movie.title}
        </h3>
        <p className="text-xs font-normal text-text-tertiary">{movie.releaseDate}</p>
      </Link>
      {/* 버튼을 링크 안에 넣지 않도록 카드 위에 겹쳐 배치해요. */}
      <button
        type="button"
        className={cn(
          'absolute top-2 right-2 flex size-[34px] cursor-pointer items-center justify-center rounded-lg border p-0',
          movie.isBookmarked
            ? 'border-action-primary bg-action-primary'
            : 'border-white bg-text-primary',
        )}
        aria-pressed={movie.isBookmarked}
        aria-label={movie.isBookmarked ? '북마크 해제' : '북마크 추가'}
        onClick={() => onToggleBookmark(movie.id)}
      >
        <img
          className="size-5 invert brightness-200"
          src={movie.isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
          alt=""
        />
      </button>
    </article>
  )
}

export default MovieCard
