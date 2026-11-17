import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { getMovieDetail } from "@/apis/movies";
import { useMeQuery } from "@/hooks/use-me-query";
import { useBookmarkStore } from "@/stores/bookmark-store";
import MovieGrid from "@/components/movies/movie-grid";
import Pagination from "@/components/pagination";
import LoadingState from "@/components/status/loading-state";
import ErrorState from "@/components/status/error-state";
import EmptyState from "@/components/status/empty-state";
import type { MovieDetail } from "@/types/movie";

// 즐겨찾기는 한 페이지에 두 줄(10편)씩 보여줘요.
const BOOKMARK_PAGE_SIZE = 10;

export function MyPage() {
  const meQuery = useMeQuery();

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-20 py-8">
      <div className="flex items-center justify-between border-b border-line pb-5">
        <h1 className="text-2xl font-bold">내 정보</h1>
        <Link
          to="/my/edit"
          className="flex h-[42px] items-center rounded-lg bg-primary px-4 text-sm font-extrabold text-white hover:bg-blue-700"
        >
          정보 수정
        </Link>
      </div>

      <section className="border-b border-line py-5">
        <h2 className="mb-4 text-sm font-bold">기본 정보</h2>
        {meQuery.isPending ? (
          <LoadingState message="내 정보를 불러오는 중이에요." />
        ) : meQuery.isError ? (
          <ErrorState error={meQuery.error} onRetry={() => meQuery.refetch()} />
        ) : (
          <div className="flex items-center gap-[18px]">
            <ProfileAvatar />
            <dl className="grid grid-flow-col grid-cols-[170px_1fr] grid-rows-2 gap-y-1.5">
              <dt className="text-[11px] text-ink-3">닉네임</dt>
              <dd className="text-sm font-bold">{meQuery.data.nickname}</dd>
              <dt className="text-[11px] text-ink-3">이메일</dt>
              <dd className="text-sm font-bold">{meQuery.data.email}</dd>
            </dl>
          </div>
        )}
      </section>

      <BookmarkSection />
    </main>
  );
}

export function ProfileAvatar() {
  return (
    <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-line">
      <img src="/icons/movie-icons/person.svg" alt="" className="size-7" />
    </span>
  );
}

function BookmarkSection() {
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(bookmarkedMovieIds.length / BOOKMARK_PAGE_SIZE));
  // 즐겨찾기를 해제해서 페이지 수가 줄어들면 마지막 페이지를 보여줘요.
  const currentPage = Math.min(page, totalPages);
  const pageMovieIds = bookmarkedMovieIds.slice(
    (currentPage - 1) * BOOKMARK_PAGE_SIZE,
    currentPage * BOOKMARK_PAGE_SIZE,
  );

  // 영화 상세 화면과 같은 query key라서 이미 본 영화는 캐시를 그대로 써요.
  const movieQueries = useQueries({
    queries: pageMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: ({ signal }: { signal: AbortSignal }) => getMovieDetail(movieId, signal),
    })),
  });

  const isPending = movieQueries.some((query) => query.isPending);
  const failedQuery = movieQueries.find((query) => query.isError);
  const movies = movieQueries
    .map((query) => query.data)
    .filter((movie): movie is MovieDetail => movie !== undefined);

  return (
    <section className="py-5">
      <h2 className="mb-4 text-sm font-bold">내 즐겨찾기</h2>
      {bookmarkedMovieIds.length === 0 ? (
        <EmptyState message="아직 즐겨찾기한 영화가 없어요." />
      ) : isPending ? (
        <LoadingState />
      ) : failedQuery ? (
        <ErrorState error={failedQuery.error} onRetry={() => failedQuery.refetch()} />
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </section>
  );
}
