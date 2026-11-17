import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";

import type { TmdbMovieDetail } from "../../api/movies/models";
import { movieQueries } from "../../api/movies/movie-queries";
import { BookmarkButton } from "../../components/bookmark-button";
import { Footer } from "../../components/layout/footer";
import { MovieImage } from "../../components/movies/movie-image";
import { RatingPanel } from "../../components/movies/rating-panel";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

function MovieDetailContent({ movie }: { movie: TmdbMovieDetail }) {
  const backdropPath = getTmdbBackdropUrl(movie.backdrop_path);
  const runtime =
    typeof movie.runtime === "number"
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보가 없어요.";

  return (
    <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
      <main className="flex-1">
        <section className="relative h-[300px] overflow-hidden bg-[#17191e] sm:h-[360px]">
          <MovieImage
            className="absolute inset-0 h-full w-full object-cover object-center"
            src={backdropPath}
            alt="영화 배경"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
          <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-between px-5 py-6 sm:px-10 lg:px-20">
            <Link
              className="inline-flex w-fit items-center gap-1 text-[13px] font-bold text-white no-underline"
              to="/"
            >
              <img className="h-6 w-6 brightness-0 invert" src="/icons/chevron-left.svg" alt="" />
              영화 목록
            </Link>
            <div className="max-w-[800px] text-white">
              <h1 className="text-3xl leading-tight font-bold tracking-[-2.3px] sm:text-[46px] sm:leading-[50px]">
                {movie.title}
              </h1>
              <p className="mt-2 text-sm">{movie.original_title}</p>
              <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[13px] font-bold">
                <span>{movie.release_date}</span>
                <span>{movie.genres.map((genre) => genre.name).join(", ")}</span>
                <span>{runtime}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-6 sm:px-10 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)_360px] lg:px-20">
          <MovieImage
            className="h-[286px] w-[200px] rounded-[10px] object-cover shadow-[0_12px_30px_rgba(12,15,20,0.12)]"
            src={getTmdbPosterUrl(movie.poster_path)}
            alt={`${movie.title} 포스터`}
          />
          <section className="min-w-0">
            <h2 className="text-[21px] font-bold tracking-[-0.63px] text-[#17191e]">
              {movie.tagline}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#606774]">{movie.overview}</p>
            <div className="mt-4">
              <BookmarkButton movieId={movie.id} detail />
            </div>
          </section>
          <RatingPanel movieId={movie.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const valid = Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  const {
    data: movie,
    error,
    isPending: isLoading,
    refetch,
  } = useQuery(movieQueries.detail(parsedMovieId));
  if (!valid || isLoading || error || !movie) {
    return (
      <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
        <main className="flex-1 px-5 py-12 sm:px-10 lg:px-20">
          <p role={error || !valid ? "alert" : "status"}>
            {!valid
              ? "올바르지 않은 영화 번호예요."
              : isLoading
                ? "영화 정보를 불러오는 중이에요."
                : error
                  ? getMovieDetailErrorMessage(error)
                  : "영화를 찾을 수 없어요."}
          </p>
          {valid && error && (
            <button type="button" onClick={() => void refetch()}>
              다시 시도
            </button>
          )}
          <Link className="mt-5 block text-blue-600" to="/">
            영화 목록으로 돌아가기
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  return <MovieDetailContent key={movie.id} movie={movie} />;
}
