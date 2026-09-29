import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  function handleToggleBookmark(id: number) {
    setMovies((previousMovies) =>
      previousMovies.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <>
      <main className="flex-1 px-4 pt-7 pb-14 sm:px-10">
        <h1 className="mt-2 mb-6 text-[26px] font-bold text-[#1a1a1a]">
          영화 목록
        </h1>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </main>

      <footer className="flex items-center justify-end gap-2 border-t border-[#ebebeb] px-4 py-[18px] text-xs text-[#9a9a9a] sm:px-10">
        <img
          className="h-3.5 w-auto"
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
        />
        <span>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </span>
      </footer>
    </>
  );
}
