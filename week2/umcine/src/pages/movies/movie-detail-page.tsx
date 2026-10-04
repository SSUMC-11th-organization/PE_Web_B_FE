import { Link, useParams } from "@tanstack/react-router";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
    const { movieId } = useParams({ from: "/movies/$movieId" });
    const movie = movies.find((item) => item.id === Number(movieId));

    if (!movie) {
        return (
            <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20">
                <p className="text-sm text-ink-tertiary">영화를 찾을 수 없어요.</p>
                <Link to="/" className="text-sm font-extrabold text-action hover:underline">
                    영화 목록으로
                </Link>
            </main>
        );
    }

    return (
        <main className="flex-1">
            <section className="relative isolate flex h-[360px] flex-col justify-between overflow-hidden bg-ink px-4 py-6 text-white sm:px-10 lg:px-20">
                <img
                    className="absolute inset-0 -z-10 size-full object-cover"
                    src={movie.backdropPath}
                    alt=""
                    aria-hidden="true"
                />
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
                    <p className="text-sm">{movie.originalTitle}</p>
                    <p className="flex flex-wrap items-center gap-x-2 text-[13px] font-bold">
                        <span>{movie.releaseDate}</span>
                        <span>{movie.genres.join(" · ")}</span>
                        <span>{movie.runtime}</span>
                    </p>
                </div>
            </section>

            <section className="flex flex-col items-start gap-6 px-4 py-6 sm:flex-row sm:gap-8 sm:px-10 lg:px-20">
                <img
                    className="h-[286px] w-[200px] shrink-0 rounded-[10px] bg-page object-cover shadow-[0_12px_30px_0_rgba(12,15,20,0.12)]"
                    src={movie.posterPath}
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
