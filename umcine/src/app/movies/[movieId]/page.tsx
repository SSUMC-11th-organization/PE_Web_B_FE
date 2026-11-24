import type { Metadata } from "next";
import { Suspense } from "react";
import { getMovieDetail } from "../../../api/movies/get-movie-detail";
import StatusMessage from "../../../components/common/status-message";
import { MovieDetailPage } from "../../../screens/movies/movie-detail-page";
import { getTmdbPosterUrl } from "../../../utils/movies/tmdb-image";

interface MovieDetailRouteProps {
  params: Promise<{ movieId: string }>;
}

// 영화마다 제목 · 설명 · 대표 이미지가 달라서 서버에서 TMDB 상세를 조회해 메타데이터를 만들어요.
export async function generateMetadata({ params }: MovieDetailRouteProps): Promise<Metadata> {
  const { movieId } = await params;
  const parsedMovieId = Number(movieId);
  if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) return { title: "영화 상세" };

  try {
    const movie = await getMovieDetail(parsedMovieId);
    const posterUrl = getTmdbPosterUrl(movie.poster_path);
    const description = movie.overview || `${movie.title}의 상세 정보예요.`;
    return {
      title: movie.title,
      description,
      openGraph: {
        title: `${movie.title} | UMCine`,
        description,
        images: posterUrl ? [posterUrl] : [],
      },
    };
  } catch {
    return { title: "영화 상세" };
  }
}

// TanStack Router의 useParams({ from: "/movies/$movieId" }) 대신 params를 await해서 Client Component에 props로 넘겨요.
export default function MovieDetailRoute({ params }: MovieDetailRouteProps) {
  return (
    <Suspense
      fallback={
        <main className="px-4 py-24 text-center">
          <StatusMessage message="영화 정보를 불러오는 중이에요." />
        </main>
      }
    >
      <MovieDetailScreen params={params} />
    </Suspense>
  );
}

async function MovieDetailScreen({ params }: MovieDetailRouteProps) {
  const { movieId } = await params;
  return <MovieDetailPage movieId={movieId} />;
}
