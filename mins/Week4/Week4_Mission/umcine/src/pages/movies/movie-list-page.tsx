import MovieGrid from "../../components/movies/movie-grid";
import { Footer } from "../../components/layout/footer";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieListPage() {
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const movieList = movies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  return (
    <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
      <main className="w-full flex-1 px-5 pb-12 pt-6 sm:px-10 lg:px-20">
        <h1 className="mb-5 text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-[#17191e]">영화 목록</h1>
        <MovieGrid movies={movieList} onToggleBookmark={toggleBookmark} />
      </main>
      <Footer />
    </div>
  );
}