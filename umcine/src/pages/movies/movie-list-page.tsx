import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getMovies } from '../../api/movies/get-movies'
import type { TmdbMovieListItem } from '../../api/movies/models'
import StatusMessage from '../../components/common/status-message'
import MovieGrid, { MovieGridSkeleton } from '../../components/movies/movie-grid'
import Pagination from '../../components/pagination'
import { TMDB_MAX_PAGE } from '../../utils/movies/parse-page'
import { toMovieCardItem } from '../../utils/movies/to-movie-card-item'

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // 값이 바뀌면 Effect가 다시 실행돼서 마지막으로 실패한 요청을 다시 보내요.
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let ignore = false
    async function loadMovies() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await getMovies({ page })
        if (!ignore) {
          setMovies(response.results)
          setTotalPages(Math.min(response.total_pages, TMDB_MAX_PAGE))
        }
      } catch {
        if (!ignore) setErrorMessage('영화 목록을 불러오지 못했어요.')
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadMovies()

    return () => {
      ignore = true
    }
  }, [page, retryCount])

  function handlePageChange(nextPage: number) {
    navigate({ search: { page: nextPage } })
    window.scrollTo({ top: 0 })
  }

  function renderContent() {
    if (isLoading) return <MovieGridSkeleton />
    if (errorMessage) {
      return <StatusMessage message={errorMessage} onRetry={() => setRetryCount((count) => count + 1)} />
    }
    if (movies.length === 0) return <StatusMessage message="조건에 맞는 영화가 없어요." />
    return <MovieGrid movies={movies.map(toMovieCardItem)} />
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 pt-6 pb-16 md:px-20">
      <h1 className="mb-5 text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">
        영화 목록
      </h1>
      {renderContent()}
      {!errorMessage && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </main>
  )
}
