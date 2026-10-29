import { movies } from "../../data/movies";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { useViewSettingsStore } from "../../stores/view-settings-store";
import { cn } from "../../utils/cn";

export function MovieListPage() {
  const cardSize = useViewSettingsStore((state) => state.cardSize);
  const setCardSize = useViewSettingsStore((state) => state.setCardSize);

  return (
    <>
      <p className="m-0 px-4 py-2.5 bg-gray-900 text-white text-center text-sm font-bold tracking-[0.02em]">
        웹B 노형원
      </p>
      <div className="min-h-screen px-8 pt-6 pb-12">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-[0_8px_32px_rgba(15,23,42,0.06)] overflow-hidden">
          <section className="px-12 pt-2 pb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="m-0 text-[32px] font-bold tracking-[-0.04em]">
                영화 목록
              </h1>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCardSize("small")}
                  aria-pressed={cardSize === "small"}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold",
                    cardSize === "small"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500",
                  )}
                >
                  작게
                </button>
                <button
                  type="button"
                  onClick={() => setCardSize("large")}
                  aria-pressed={cardSize === "large"}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold",
                    cardSize === "large"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500",
                  )}
                >
                  크게
                </button>
              </div>
            </div>
            <MovieGrid movies={movies} />
          </section>
          <Pagination />
          <footer className="flex justify-end items-center px-12 pt-4 pb-7">
            <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-4 w-auto" />
          </footer>
        </div>
      </div>
    </>
  );
}