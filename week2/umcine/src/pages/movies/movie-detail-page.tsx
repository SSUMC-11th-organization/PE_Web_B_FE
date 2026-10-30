import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

function formatRuntime(runtime: number | null) {
    if (!runtime) return null;

    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}

export function MovieDetailPage() {
    const { movieId } = useParams({ from: "/movies/$movieId" });
    const parsedMovieId = Number(movieId);
    const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

    const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
    const [isLoading, setIsLoading] = useState(isValidMovieId);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isValidMovieId) return;

        let ignore = false;
        async function loadMovie() {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const response = await getMovieDetail(parsedMovieId);
                if (!ignore) setMovie(response);
            } catch (error) {
                if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
            } finally {
                if (!ignore) setIsLoading(false);
            }
        }

        loadMovie();

        return () => {
            ignore = true;
        };
    }, [parsedMovieId, isValidMovieId]);

    if (isValidMovieId && isLoading) {
        return (
            <main className="flex flex-1 flex-col items-center justify-center px-4 py-20">
                <p className="text-sm text-ink-tertiary">영화 정보를 불러오는 중이에요.</p>
            </main>
        );
    }

    if (!isValidMovieId || errorMessage || !movie) {
        return (
            <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20">
                <p className="text-sm text-ink-tertiary">
                    {!isValidMovieId ? "올바르지 않은 영화 번호예요." : (errorMessage ?? "영화를 찾을 수 없어요.")}
                </p>
                <Link to="/" className="text-sm font-extrabold text-action hover:underline">
                    영화 목록으로
                </Link>
            </main>
        );
    }

    const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
    const posterUrl = getTmdbPosterUrl(movie.poster_path);
    const runtime = formatRuntime(movie.runtime);

    return (
        <main className="flex-1">
            <section className="relative isolate flex h-[360px] flex-col justify-between overflow-hidden bg-ink px-4 py-6 text-white sm:px-10 lg:px-20">
                {backdropUrl && (
                    <img
                        className="absolute inset-0 -z-10 size-full object-cover"
                        src={backdropUrl}
                        alt=""
                        aria-hidden="true"
                    />
                )}
                {/* 배경이 밝은 영화에서도 흰 글자가 읽히도록 아래쪽만 어둡게 해요 */}
                <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/60 via-black/10 to-black/20" />

                <Link to="/" className="flex w-fit items-center gap-1 text-[13px] font-bold">
                    <img className="size-6 invert" src="/icons/chevron-left.svg" alt="" />
                    영화 목록
                </Link>

                <div className="flex max-w-[800px] flex-col gap-2">
                    <h1 className="text-[32px] leading-[1.08] font-bold tracking-[-1.6px] sm:text-[46px] sm:tracking-[-2.3px]">
                        {movie.title}
                    </h1>
                    <p className="text-sm">{movie.original_title}</p>
                    <p className="flex flex-wrap items-center gap-x-2 text-[13px] font-bold">
                        <span>{movie.release_date}</span>
                        <span>{movie.genres.map((genre) => genre.name).join(" · ")}</span>
                        {runtime && <span>{runtime}</span>}
                    </p>
                </div>
            </section>

            <section className="flex flex-col items-start gap-6 px-4 py-6 sm:flex-row sm:gap-8 sm:px-10 lg:px-20">
                <img
                    className="h-[286px] w-[200px] shrink-0 rounded-[10px] bg-page object-cover shadow-[0_12px_30px_0_rgba(12,15,20,0.12)]"
                    src={posterUrl ?? undefined}
                    alt={`${movie.title} 포스터`}
                />

                <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
                    <h2 className="text-[21px] font-bold tracking-[-0.63px] text-ink">{movie.tagline}</h2>
                    <p className="text-sm leading-6 text-ink-secondary">{movie.overview}</p>
                    <BookmarkButton movieId={movie.id} movieTitle={movie.title} variant="label" />
                </div>
            </section>
        </main>
    );
}
