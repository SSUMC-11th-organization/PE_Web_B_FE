import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

// TMDB 인기 영화는 수백 페이지라서 버튼은 앞쪽 5페이지까지만 보여 줘요
const MAX_VISIBLE_PAGES = 5;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalPages, setTotalPages] = useState(MAX_VISIBLE_PAGES);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: currentPage });
        if (!ignore) {
          setMovies(response.results);
          setTotalPages(Math.min(response.total_pages, MAX_VISIBLE_PAGES));
        }
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [currentPage]);

  return (
    <main className="flex flex-1 flex-col gap-5 px-4 py-6 sm:px-10 lg:px-20">
      <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-ink">
        영화 목록
      </h1>
      {isLoading ? (
        <p className="py-20 text-center text-sm text-ink-tertiary">영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p className="py-20 text-center text-sm text-ink-tertiary">{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p className="py-20 text-center text-sm text-ink-tertiary">표시할 영화가 없어요.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </main>
  );
}
