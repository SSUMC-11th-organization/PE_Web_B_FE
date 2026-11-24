"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { movieQueries } from "../../api/movies/queries";
import StatusMessage from "../../components/common/status-message";
import BookmarkButton from "../../components/movies/bookmark-button";
import MoviePoster from "../../components/movies/movie-poster";
import { MyRatingSection } from "../../components/movies/my-rating-section";
import { formatRuntime } from "../../utils/movies/format-runtime";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface MovieDetailPageProps {
  movieId: string;
}

// movieId는 page.tsx(Server Component)가 params에서 읽어 props로 넘겨 줘요.
export function MovieDetailPage({ movieId }: MovieDetailPageProps) {
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  // 유효하지 않은 ID라면 enabled가 false라서 요청하지 않아요.
  const movieDetailQuery = useQuery(movieQueries.detail(parsedMovieId));
  if (!isValidMovieId || movieDetailQuery.isPending || movieDetailQuery.isError) {
    let content;
    // 요청하지 않아도 isPending이 참일 수 있어서 잘못된 번호 안내를 로딩보다 먼저 확인해요.
    if (!isValidMovieId) {
      content = <StatusMessage message="올바르지 않은 영화 번호예요." />;
    } else if (movieDetailQuery.isPending) {
      content = <StatusMessage message="영화 정보를 불러오는 중이에요." />;
    } else {
      const message = getMovieDetailErrorMessage(movieDetailQuery.error);
      // 404는 다시 시도해도 같은 결과이므로 다시 시도 버튼을 보여 주지 않아요.
      const canRetry = message !== "영화를 찾을 수 없어요.";
      content = (
        <StatusMessage
          message={message}
          onRetry={canRetry ? () => movieDetailQuery.refetch() : undefined}
        />
      );
    }

    return (
      <main className="mx-auto max-w-[1440px] px-4 py-24 text-center md:px-20">
        {content}
        {!(isValidMovieId && movieDetailQuery.isPending) && (
          <Link className="mt-4 inline-block text-sm font-bold text-action-primary hover:underline" href="/">
            영화 목록으로 돌아가기
          </Link>
        )}
      </main>
    );
  }

  const movie = movieDetailQuery.data;
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const genres = movie.genres.map((genre) => genre.name).join(", ");

  return (
    <main className="relative isolate min-h-[calc(100dvh-75px)] overflow-hidden bg-text-primary">
      {backdropUrl ? (
        <Image
          className="-z-10 object-cover"
          src={backdropUrl}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          priority
        />
      ) : (
        <div className="absolute inset-0 -z-10 flex items-center justify-center bg-text-secondary text-sm text-white/50">
          이미지 없음
        </div>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />

      <div className="mx-auto max-w-[1440px] px-4 pt-6 pb-16 md:px-20">
        <Link
          className="inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white"
          href="/"
        >
          <img className="size-4 invert" src="/icons/chevron-left.svg" alt="" />
          영화 목록
        </Link>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:gap-10">
          <MoviePoster
            className="h-[360px] w-[248px] shrink-0 rounded-xl shadow-2xl"
            sizes="248px"
            src={getTmdbPosterUrl(movie.poster_path)}
            alt={`${movie.title} 포스터`}
          />
          <div className="flex max-w-[720px] flex-col gap-2 text-white">
            <div className="flex items-center gap-3">
              <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px]">{movie.title}</h1>
              {/* 상세 화면은 GET /favorites/{movieId}로 이 영화의 즐겨찾기 여부만 확인해요. */}
              <BookmarkButton movieId={movie.id} source="status" />
            </div>
            <p className="text-lg text-white/70">{movie.original_title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
              <p>{movie.release_date || "개봉일 정보 없음"}</p>
              <span aria-hidden="true">·</span>
              <p>{genres || "장르 정보 없음"}</p>
              <span aria-hidden="true">·</span>
              <p>{formatRuntime(movie.runtime)}</p>
            </div>
            {movie.tagline && <h2 className="mt-6 text-xl font-bold">{movie.tagline}</h2>}
            <p className="text-base leading-relaxed text-white/80">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>
            <MyRatingSection movieId={movie.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
