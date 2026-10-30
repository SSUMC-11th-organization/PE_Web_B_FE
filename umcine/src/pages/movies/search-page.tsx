import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import BookmarkButton from "../../components/movies/bookmark-button";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [prevQuery, setPrevQuery] = useState(query);

  // 뒤로/앞으로 가기로 URL의 query가 바뀌면 입력창도 맞춰요.
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
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
        <p className="mt-10 rounded-[10px] bg-bg-surface py-16 text-center text-sm text-text-secondary">
          검색어를 입력해 주세요.
        </p>
      ) : (
        <section className="mt-10">
          <div className="mb-5 flex items-baseline gap-3">
            <h2 className="text-2xl font-bold tracking-[-0.8px] text-text-primary">
              ‘{query}’ 검색 결과
            </h2>
            <p className="text-sm text-text-tertiary">영화 {searchResults.length}편</p>
          </div>
          {searchResults.length === 0 ? (
            <p className="rounded-[10px] bg-bg-surface py-16 text-center text-sm text-text-secondary">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-5 rounded-[10px] border border-border-default bg-bg-surface p-4"
                >
                  <img
                    className="h-[174px] w-[120px] shrink-0 rounded-lg object-cover"
                    src={movie.posterPath}
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
          )}
        </section>
      )}
    </main>
  );
}
