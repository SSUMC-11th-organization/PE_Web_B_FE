import type { MovieCardItem } from '../../types/movie'
import MovieCard from './movie-card'

interface MovieGridProps {
  movies: MovieCardItem[]
}

const gridClass =
  'grid grid-cols-1 gap-x-[18px] gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'

function MovieGrid({ movies }: MovieGridProps) {
  return (
    <section className={gridClass}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  )
}

// 로딩 중에는 카드와 같은 크기의 skeleton을 보여 줘요.
export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <section className={gridClass} aria-busy="true" aria-label="영화 목록을 불러오는 중이에요.">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex animate-pulse flex-col gap-1">
          <div className="h-[274px] w-full rounded-[10px] bg-border-default" />
          <div className="mt-[5px] h-3.5 w-3/4 rounded bg-border-default" />
          <div className="h-3 w-1/3 rounded bg-border-default" />
        </div>
      ))}
    </section>
  )
}

export default MovieGrid
