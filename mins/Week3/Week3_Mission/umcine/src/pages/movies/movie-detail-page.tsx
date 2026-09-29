import { Link, useParams } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Footer } from "../../components/layout/footer";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

function MovieDetailContent({ movie }: { movie: Movie }) {
  const [isBookmarked, setIsBookmarked] = useState(movie.isBookmarked);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const backdropPath = movie.id === 1
    ? "/images/movies/spider-man-brand-new-day-figma-backdrop.webp"
    : movie.backdropPath;

  function handleSaveRating(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(rating ? `${rating}점 평점을 저장했어요.` : "별점을 선택해 주세요.");
  }

  return (
    <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
      <main className="flex-1">
        <section className="relative h-[300px] overflow-hidden bg-[#17191e] sm:h-[360px]">
          <img className="absolute inset-0 h-full w-full object-cover object-center" src={backdropPath} alt="" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
          <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-between px-5 py-6 sm:px-10 lg:px-20">
            <Link className="inline-flex w-fit items-center gap-1 text-[13px] font-bold text-white no-underline" to="/">
              <img className="h-6 w-6 brightness-0 invert" src="/icons/chevron-left.svg" alt="" />
              영화 목록
            </Link>
            <div className="max-w-[800px] text-white">
              <h1 className="text-3xl leading-tight font-bold tracking-[-2.3px] sm:text-[46px] sm:leading-[50px]">{movie.title}</h1>
              <p className="mt-2 text-sm">{movie.originalTitle}</p>
              <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[13px] font-bold">
                <span>{movie.releaseDate}</span>
                <span>{movie.genres.join(" · ")}</span>
                <span>{movie.runtime}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-6 sm:px-10 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)_360px] lg:px-20">
          <img className="h-[286px] w-[200px] rounded-[10px] object-cover shadow-[0_12px_30px_rgba(12,15,20,0.12)]" src={movie.posterPath} alt={`${movie.title} 포스터`} />
          <section className="min-w-0">
            <h2 className="text-[21px] font-bold tracking-[-0.63px] text-[#17191e]">{movie.tagline}</h2>
            <p className="mt-3 text-sm leading-6 text-[#606774]">{movie.overview}</p>
            <button
              className={cn("mt-4 inline-flex h-[42px] cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-extrabold text-white", isBookmarked ? "bg-[#17191e]" : "bg-[#2563eb]")}
              type="button"
              aria-pressed={isBookmarked}
              onClick={() => setIsBookmarked((current) => !current)}
            >
              <img className="h-4 w-4 brightness-0 invert" src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
              {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
            </button>
          </section>
          <form className="border-t border-[#e3e6eb] pt-6 md:col-start-2 lg:col-start-3 lg:row-start-1 lg:border-t-0 lg:border-l lg:py-0 lg:pl-[30px]" onSubmit={handleSaveRating}>
            <h2 className="text-[21px] font-bold tracking-[-0.63px] text-[#17191e]">내 평점</h2>
            <p className="mt-2 text-xs text-[#969da8]">별점은 필수, 후기는 선택이에요.</p>
            <div className="mt-2 flex gap-1" role="group" aria-label="영화 별점">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  className={cn("flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-lg border border-[#e3e6eb] bg-white", score <= rating && "border-[#2563eb] bg-[#2563eb]")}
                  type="button"
                  aria-label={`${score}점`}
                  aria-pressed={score === rating}
                  onClick={() => { setRating(score); setMessage(""); }}
                >
                  <img className={cn("h-6 w-6 opacity-60", score <= rating && "brightness-0 invert opacity-100")} src="/icons/star.svg" alt="" />
                </button>
              ))}
            </div>
            <textarea
              className="mt-2 h-[102px] w-full resize-y rounded-lg border border-[#e3e6eb] bg-white px-3 py-4 text-[13px] leading-[19.5px] text-[#17191e] placeholder:text-[#969da8]"
              aria-label="영화 후기"
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              value={review}
              onChange={(event) => setReview(event.target.value)}
            />
            <button className="mt-2 h-[42px] w-full cursor-pointer rounded-lg bg-[#17191e] text-sm font-extrabold text-white" type="submit">평점 저장</button>
            {message && <p className="mt-2 text-xs text-[#606774]" role="status">{message}</p>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="min-h-[calc(100vh-91px)] bg-[#f6f7f9] px-5 py-12 sm:px-10 lg:px-20">
        <h1 className="text-2xl font-bold text-[#17191e]">영화를 찾을 수 없어요.</h1>
        <Link className="mt-5 inline-block text-[#2563eb]" to="/">영화 목록으로 돌아가기</Link>
      </main>
    );
  }

  return <MovieDetailContent key={movie.id} movie={movie} />;
}
