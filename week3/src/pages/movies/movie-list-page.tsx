import MovieGrid from "../../components/movies/movie-grid";
import LoadingState from "../../components/status/loading-state";
import ErrorState from "../../components/status/error-state";
import EmptyState from "../../components/status/empty-state";
import { getPopularMovies } from "../../apis/movies";
import { useAsync } from "../../hooks/use-async";

function MovieListPage() {
  const result = useAsync((signal) => getPopularMovies(signal), []);

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-20 py-10">
      <h1 className="mb-7 text-2xl font-bold">영화 목록</h1>
      {result.status === "loading" && <LoadingState />}
      {result.status === "error" && <ErrorState error={result.error} onRetry={result.retry} />}
      {result.status === "success" &&
        (result.data.movies.length === 0 ? (
          <EmptyState message="표시할 영화가 없어요." />
        ) : (
          <MovieGrid movies={result.data.movies} />
        ))}
    </main>
  );
}

export default MovieListPage;
