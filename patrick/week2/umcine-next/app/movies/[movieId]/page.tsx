import { Suspense } from "react";
import { MovieDetailPage } from "@/screens/movies/movie-detail-page";

interface MovieDetailRouteProps {
  params: Promise<{ movieId: string }>;
}

export default function MovieDetailRoute({ params }: MovieDetailRouteProps) {
  // 주소의 영화 번호는 요청이 와야 알 수 있어서 Suspense 안에서 읽어요
  return (
    <Suspense fallback={<main>영화 정보를 불러오는 중이에요.</main>}>
      <MovieDetailContent params={params} />
    </Suspense>
  );
}

async function MovieDetailContent({ params }: MovieDetailRouteProps) {
  const { movieId } = await params;

  return <MovieDetailPage movieIdParam={movieId} />;
}
