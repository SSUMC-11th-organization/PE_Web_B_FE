import { useState } from 'react'
import MovieGrid from '../../components/movies/movie-grid'
import Pagination from '../../components/pagination'
import { movies as initialMovies } from '../../data/movies'
import type { Movie } from '../../types/movie'

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [currentPage, setCurrentPage] = useState(1)

  const handleToggleBookmark = (id: number) => {
    setMovies((prev) =>
      prev.map((movie) => (movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie)),
    )
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 pt-6 pb-16 md:px-20">
      <h1 className="mb-5 text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">
        영화 목록
      </h1>
      <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
    </main>
  )
}
