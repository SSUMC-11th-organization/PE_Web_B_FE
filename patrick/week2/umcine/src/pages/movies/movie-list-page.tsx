import { useState } from "react";
import { movies as initialMovies } from "../../data/movies";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <>
      <p className="m-0 px-4 py-2.5 bg-gray-900 text-white text-center text-sm font-bold tracking-[0.02em]">
        웹B 노형원
      </p>
      <div className="min-h-screen px-8 pt-6 pb-12">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-[0_8px_32px_rgba(15,23,42,0.06)] overflow-hidden">
          <section className="px-12 pt-2 pb-8">
            <h1 className="m-0 mb-6 text-[32px] font-bold tracking-[-0.04em]">
              영화 목록
            </h1>
            <MovieGrid
              movies={movies}
              onToggleBookmark={handleToggleBookmark}
            />
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
