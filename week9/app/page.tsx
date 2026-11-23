import MovieList from "@/components/movies/movie-list";

export default function MovieListPage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-20 py-10">
      <h1 className="mb-7 text-2xl font-bold">영화 목록</h1>
      <MovieList />
    </main>
  );
}
