"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import MovieGrid from "@/components/movies/movie-grid";
import Pagination from "@/components/pagination";
import LoadingState from "@/components/status/loading-state";
import ErrorState from "@/components/status/error-state";
import EmptyState from "@/components/status/empty-state";
import { getPopularMovies } from "@/apis/movies";

function MovieList() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: ({ signal }) => getPopularMovies(page, signal),
    // 다음 페이지를 불러오는 동안 이전 페이지 목록을 그대로 보여줘요.
    placeholderData: keepPreviousData,
  });

  const movies = moviesQuery.data?.movies ?? [];
  const totalPages = moviesQuery.data?.totalPages ?? 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0 });
  };

  if (moviesQuery.isPending) return <LoadingState />;

  if (moviesQuery.isError) {
    return <ErrorState error={moviesQuery.error} onRetry={() => moviesQuery.refetch()} />;
  }

  if (movies.length === 0) return <EmptyState message="표시할 영화가 없어요." />;

  return (
    <>
      <MovieGrid movies={movies} />
      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </>
  );
}

export default MovieList;
