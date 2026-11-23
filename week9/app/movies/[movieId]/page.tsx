import { Suspense } from "react";
import MovieDetail from "@/components/movies/movie-detail";
import MovieNotFound from "@/components/movies/movie-not-found";
import LoadingState from "@/components/status/loading-state";

export default function MovieDetailPage({ params }: PageProps<"/movies/[movieId]">) {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 flex-col">
          <LoadingState />
        </main>
      }
    >
      <MovieDetailContent params={params} />
    </Suspense>
  );
}

// params는 요청 시점에 정해지는 Promise라서 Suspense 안쪽에서 await해요.
async function MovieDetailContent({
  params,
}: Pick<PageProps<"/movies/[movieId]">, "params">) {
  const movieId = Number((await params).movieId);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    return <MovieNotFound />;
  }

  return <MovieDetail movieId={movieId} />;
}
