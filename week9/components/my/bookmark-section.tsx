"use client";

import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { getMovieDetail } from "@/apis/movies";
import MovieGrid from "@/components/movies/movie-grid";
import Pagination from "@/components/pagination";
import EmptyState from "@/components/status/empty-state";
import ErrorState from "@/components/status/error-state";
import LoadingState from "@/components/status/loading-state";
import { useBookmarkStore } from "@/stores/bookmark-store";
import type { MovieDetail } from "@/types/movie";

// 즐겨찾기는 한 페이지에 두 줄(10편)씩 보여줘요.
const BOOKMARK_PAGE_SIZE = 10;

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

  if (bookmarkedMovieIds.length === 0) {
    return <EmptyState message="아직 즐겨찾기한 영화가 없어요." />;
  }

  if (isPending) return <LoadingState />;

  if (failedQuery) {
    return <ErrorState error={failedQuery.error} onRetry={() => failedQuery.refetch()} />;
  }

  return (
    <>
      <MovieGrid movies={movies} />
      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}

export default BookmarkSection;
