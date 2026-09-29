import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
    const { movieId } = useParams({ from: "/movies/$movieId" });
    const movie = movies.find((item) => item.id === Number(movieId));

    if (!movie) {
        return (
            <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20">
                <p className="text-[15px] text-[#9a9a9a]">영화를 찾을 수 없어요.</p>
                <Link to="/" className="text-sm font-semibold text-[#2563eb] hover:underline">
                    영화 목록으로
                </Link>
            </main>
        );
    }

    return (
        <main className="flex-1">
            <section className="relative isolate overflow-hidden bg-[#1a1a1a] text-white">
                <img
                    className="absolute inset-0 -z-10 size-full object-cover opacity-40"
                    src={movie.backdropPath}
                    alt=""
                    aria-hidden="true"
                />
                <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/80 via-black/50 to-transparent" />

                <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-6 pb-10 sm:px-10 sm:pb-14">
                    <Link
                        to="/"
                        className="flex w-fit items-center gap-1 text-sm text-white/80 transition-colors hover:text-white"
                    >
                        <img className="size-4 rotate-180 invert" src="/icons/arrow-right.svg" alt="" />
                        영화 목록
                    </Link>

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-10">
                        <img
                            className="aspect-2/3 w-40 shrink-0 rounded-[10px] object-cover shadow-2xl sm:w-60"
                            src={movie.posterPath}
                            alt={`${movie.title} 포스터`}
                        />

                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold sm:text-4xl">{movie.title}</h1>
                            <p className="text-base text-white/70">{movie.originalTitle}</p>
                            <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-white/80">
                                <span>{movie.releaseDate}</span>
                                <span aria-hidden="true">·</span>
                                <span>{movie.genres.join(", ")}</span>
                                <span aria-hidden="true">·</span>
                                <span>{movie.runtime}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-10 sm:px-10">
                <h2 className="text-lg font-semibold italic text-[#4b4b4b]">{movie.tagline}</h2>
                <h3 className="mt-6 mb-2 text-base font-semibold">줄거리</h3>
                <p className="max-w-3xl text-[15px] leading-relaxed text-[#4b4b4b]">{movie.overview}</p>
            </section>
        </main>
    );
}
