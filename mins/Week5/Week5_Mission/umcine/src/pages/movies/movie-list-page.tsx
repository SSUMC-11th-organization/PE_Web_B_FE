import MovieGrid from "../../components/movies/movie-grid";
import { Footer } from "../../components/layout/footer";
import { getMovies } from "../../api/movies/get-movies";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { useMovieRequest } from "../../hooks/use-movie-request";
import { toMovieCard } from "../../utils/movies/movie-adapter";
const loadMovies = () => getMovies({ page: 1 });
const listError = () => "영화 목록을 불러오지 못했어요.";
export function MovieListPage() {
  const ids = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const { data, error, isLoading, retry } = useMovieRequest("popular", loadMovies, listError);
  return (
    <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
      <main className="w-full flex-1 px-5 pb-12 pt-6 sm:px-10 lg:px-20">
        <h1 className="mb-5 text-[38px] font-bold">영화 목록</h1>
        {isLoading ? <p role="status">영화 목록을 불러오는 중이에요.</p>
          : error ? <div role="alert"><p>{error}</p><button type="button" onClick={retry}>다시 시도</button></div>
          : !data?.results.length ? <p>조건에 맞는 영화가 없어요.</p>
          : <MovieGrid movies={data.results.map((movie) => toMovieCard(movie, ids.includes(movie.id)))} onToggleBookmark={toggleBookmark} />}
      </main><Footer />
    </div>
  );
}
