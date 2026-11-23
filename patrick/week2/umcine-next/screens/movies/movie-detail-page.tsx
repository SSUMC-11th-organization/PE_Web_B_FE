"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { movieQueries } from "../../api/movies/movie-queries";
import { ErrorMessage } from "../../components/error-message";
import { FavoriteButton } from "../../components/favorite-button";
import { TmdbFooter } from "../../components/layout/tmdb-footer";
import { MovieRatingSection } from "../../components/movies/movie-rating-section";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

function formatRuntime(runtime: number | null) {
  if (runtime === null) return "상영 시간 정보가 없어요.";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}

interface MovieDetailPageProps {
  movieIdParam: string;
}

// 주소의 영화 번호는 app/movies/[movieId]/page.tsx가 읽어서 넘겨 줘요
export function MovieDetailPage({ movieIdParam }: MovieDetailPageProps) {
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    ...movieQueries.detail(movieId),
    enabled: isValidMovieId,
  });

  if (!isValidMovieId) {
    return <main>올바르지 않은 영화 번호예요.</main>;
  }

  if (movieDetailQuery.isPending) {
    return <main>영화 정보를 불러오는 중이에요.</main>;
  }

  if (movieDetailQuery.isError) {
    return (
      <main>
        <ErrorMessage
          message={getMovieDetailErrorMessage(movieDetailQuery.error)}
          onRetry={() => movieDetailQuery.refetch()}
        />
      </main>
    );
  }

  const movie = movieDetailQuery.data;
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <>
      <main>
        {backdropUrl ? (
          <img src={backdropUrl} alt="" aria-hidden="true" />
        ) : (
          <div>이미지 없음</div>
        )}
        <Link href="/">영화 목록</Link>
        {posterUrl ? (
          <img src={posterUrl} alt={`${movie.title} 포스터`} />
        ) : (
          <div>이미지 없음</div>
        )}
        <FavoriteButton movieId={movie.id} />
        <h1>{movie.title}</h1>
        <p>{movie.original_title}</p>
        <p>{movie.release_date}</p>
        <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>
        <p>{formatRuntime(movie.runtime)}</p>
        <h2>{movie.tagline}</h2>
        <p>{movie.overview}</p>
        <MovieRatingSection movieId={movie.id} />
      </main>
      <TmdbFooter />
    </>
  );
}
