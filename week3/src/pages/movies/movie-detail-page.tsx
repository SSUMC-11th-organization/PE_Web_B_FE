import { useState } from "react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";
import type { Movie } from "../../types/movie";

const route = getRouteApi("/movies/$movieId");

const STARS = [1, 2, 3, 4, 5];

function MovieDetailPage() {
  const { movieId } = route.useParams();
  const movie = movies.find((m) => String(m.id) === movieId);

  if (!movie) {
    return (
      <main className="flex flex-1 items-center justify-center py-40">
        <p className="text-lg text-ink-2">영화를 찾을 수 없어요.</p>
      </main>
    );
  }

  return <MovieDetail key={movie.id} movie={movie} />;
}

function MovieDetail({ movie }: { movie: Movie }) {
  const [bookmarked, setBookmarked] = useState(movie.isBookmarked);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative h-[360px] w-full overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
        <div className="absolute inset-0 mx-auto flex max-w-[1440px] flex-col justify-between px-20 py-6 text-white">
          <Link to="/" className="flex items-center gap-1 text-[13px] font-bold">
            <img src="/icons/movie-icons/chevron-left.svg" alt="" className="size-6 invert" />
            영화 목록
          </Link>
          <div className="flex w-[800px] max-w-full flex-col gap-2">
            <h1 className="text-[46px] font-bold leading-[49.68px] tracking-[-2.3px]">
              {movie.title}
            </h1>
            <p className="text-sm">{movie.originalTitle}</p>
            <div className="flex items-center gap-2 text-[13px] font-bold">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-[1440px] items-start gap-8 px-20 py-6">
        <div className="h-[286px] w-[200px] shrink-0 overflow-hidden rounded-[10px] bg-page shadow-[0_12px_30px_rgba(12,15,20,0.12)]">
          <img src={movie.posterPath} alt={movie.title} className="size-full object-cover" />
        </div>

        <section className="flex min-w-0 flex-1 flex-col items-start gap-3">
          <h2 className="text-[21px] font-bold tracking-[-0.63px]">{movie.tagline}</h2>
          <p className="text-sm leading-6 text-ink-2">{movie.overview}</p>
          <button
            type="button"
            aria-pressed={bookmarked}
            onClick={() => setBookmarked((b) => !b)}
            className={cn(
              "flex h-[42px] items-center gap-2 rounded-lg px-4 text-sm font-extrabold text-white",
              bookmarked ? "bg-ink" : "bg-primary",
            )}
          >
            <img
              src={
                bookmarked
                  ? "/icons/movie-icons/bookmark.svg"
                  : "/icons/movie-icons/bookmark-outline.svg"
              }
              alt=""
              className="size-4 invert"
            />
            즐겨찾기
          </button>
        </section>

        <aside className="flex w-[360px] shrink-0 flex-col items-start gap-2 border-l border-line pb-[41px] pl-[30px]">
          <h2 className="text-[21px] font-bold tracking-[-0.63px]">내 평점</h2>
          <p className="text-xs text-ink-3">별점은 필수, 후기는 선택이에요.</p>
          <div className="flex gap-1">
            {STARS.map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n}점`}
                aria-pressed={rating === n}
                onClick={() => setRating(n)}
                className="flex size-[38px] items-center justify-center rounded-lg border border-line bg-surface"
              >
                <span
                  className={cn(
                    "size-6 bg-ink-2 [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]",
                    n <= rating && "bg-amber-400",
                  )}
                  style={{
                    maskImage: "url(/icons/movie-icons/star.svg)",
                    WebkitMaskImage: "url(/icons/movie-icons/star.svg)",
                  }}
                />
              </button>
            ))}
          </div>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="h-[102px] w-full resize-none rounded-lg border border-line bg-surface px-3 pb-[18px] pt-4 text-[13px] leading-[19.5px] outline-none placeholder:text-ink-3"
          />
          <button
            type="button"
            className="h-[42px] w-full rounded-lg bg-ink text-sm font-extrabold text-white"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}

export default MovieDetailPage;
