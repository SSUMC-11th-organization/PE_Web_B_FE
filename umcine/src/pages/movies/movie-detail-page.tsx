import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="mx-auto max-w-[1440px] px-4 py-24 text-center md:px-20">
        <p className="text-lg font-bold text-text-primary">영화를 찾을 수 없어요.</p>
        <Link className="mt-4 inline-block text-sm font-bold text-action-primary hover:underline" to="/">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="relative isolate min-h-[calc(100dvh-75px)] overflow-hidden bg-text-primary">
      <img
        className="absolute inset-0 -z-10 size-full object-cover"
        src={movie.backdropPath}
        alt=""
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />

      <div className="mx-auto max-w-[1440px] px-4 pt-6 pb-16 md:px-20">
        <Link
          className="inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white"
          to="/"
        >
          <img className="size-4 invert" src="/icons/chevron-left.svg" alt="" />
          영화 목록
        </Link>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:gap-10">
          <img
            className="h-[360px] w-[248px] shrink-0 rounded-xl object-cover shadow-2xl"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
          <div className="flex max-w-[720px] flex-col gap-2 text-white">
            <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px]">{movie.title}</h1>
            <p className="text-lg text-white/70">{movie.originalTitle}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
              <p>{movie.releaseDate}</p>
              <span aria-hidden="true">·</span>
              <p>{movie.genres.join(" · ")}</p>
              <span aria-hidden="true">·</span>
              <p>{movie.runtime}</p>
            </div>
            <h2 className="mt-6 text-xl font-bold">{movie.tagline}</h2>
            <p className="text-base leading-relaxed text-white/80">{movie.overview}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
