import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import StatusMessage from "../../components/common/status-message";
import BookmarkButton from "../../components/movies/bookmark-button";
import MoviePoster from "../../components/movies/movie-poster";
import Pagination from "../../components/pagination";
import { TMDB_MAX_PAGE } from "../../utils/movies/parse-page";
import { toMovieCardItem } from "../../utils/movies/to-movie-card-item";

export function SearchPage() {
  const { query = "", page = 1 } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query);
  const [prevQuery, setPrevQuery] = useState(query);

  // 뒤로/앞으로 가기로 URL의 query가 바뀌면 입력창도 맞춰요.
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query);
  }

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  // 첫 화면에서 검색어가 있으면 바로 로딩 상태로 시작해요.
  const [isLoading, setIsLoading] = useState(Boolean(query.trim()));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const normalizedQuery = query.trim();

  // 검색어, 페이지가 바뀌거나 다시 시도하면 렌더링 중에 이전 결과를 비워요. (Effect 안에서 바로 setState하지 않기 위해서예요.)
  const requestKey = `${normalizedQuery}|${page}|${retryCount}`;
  const [prevRequestKey, setPrevRequestKey] = useState(requestKey);
  if (requestKey !== prevRequestKey) {
    setPrevRequestKey(requestKey);
    setMovies([]);
    setErrorMessage(null);
    setIsLoading(Boolean(normalizedQuery));
  }

  useEffect(() => {
    // 빈 검색어라면 요청하지 않아요.
    if (!normalizedQuery) return;

    let ignore = false;

    searchMovies({ query: normalizedQuery, page })
      .then((response) => {
        if (!ignore) {
          setMovies(response.results);
          setTotalResults(response.total_results);
          setTotalPages(Math.min(response.total_pages, TMDB_MAX_PAGE));
        }
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [normalizedQuery, page, retryCount]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    // 새 검색어로 검색하면 1페이지부터 다시 보여 줘요.
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  function handlePageChange(nextPage: number) {
    navigate({ search: (prev) => ({ ...prev, page: nextPage }) });
    window.scrollTo({ top: 0 });
  }

  function renderResults() {
    if (isLoading) return <StatusMessage message="검색 결과를 불러오는 중이에요." />;
    if (errorMessage) {
      return (
        <StatusMessage message={errorMessage} onRetry={() => setRetryCount((count) => count + 1)} />
      );
    }
    if (movies.length === 0) return <StatusMessage message="조건에 맞는 영화가 없어요." />;

    return (
      <>
        <ul className="flex flex-col gap-4">
          {movies.map(toMovieCardItem).map((movie) => (
            <li
              key={movie.id}
              className="flex gap-5 rounded-[10px] border border-border-default bg-bg-surface p-4"
            >
              <MoviePoster
                className="h-[174px] w-[120px] shrink-0 rounded-lg"
                src={movie.posterUrl}
                alt={`${movie.title} 포스터`}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-extrabold text-text-primary">{movie.title}</h3>
                  <BookmarkButton movieId={movie.id} />
                </div>
                <p className="text-sm text-text-secondary">{movie.originalTitle}</p>
                <p className="text-xs text-text-tertiary">{movie.releaseDate}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                  {movie.overview}
                </p>
                <Link
                  className="mt-auto self-start text-sm font-bold text-action-primary hover:underline"
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                >
                  상세 보기
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </>
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 pt-6 pb-16 md:px-20">
      <h1 className="mb-5 text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">
        영화 검색
      </h1>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <div className="flex h-12 flex-1 items-center gap-2 rounded-[10px] border border-border-default bg-bg-surface px-4 focus-within:border-action-primary">
          <img className="size-5 opacity-50" src="/icons/search.svg" alt="" />
          <input
            className="h-full flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
            aria-label="검색어"
            placeholder="영화 제목이나 원제를 입력해 주세요"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>
        <button
          className="h-12 cursor-pointer rounded-[10px] bg-action-primary px-6 text-sm font-bold text-white"
          type="submit"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <StatusMessage className="mt-10" message="검색어를 입력해 주세요." />
      ) : (
        <section className="mt-10">
          <div className="mb-5 flex items-baseline gap-3">
            <h2 className="text-2xl font-bold tracking-[-0.8px] text-text-primary">
              ‘{normalizedQuery}’ 검색 결과
            </h2>
            {!isLoading && !errorMessage && (
              <p className="text-sm text-text-tertiary">영화 {totalResults.toLocaleString()}편</p>
            )}
          </div>
          {renderResults()}
        </section>
      )}
    </main>
  );
}
