import type { Metadata } from "next";
import { getServerMovie } from "../../../lib/server-movie";
import { MovieDetailPage } from "../../../screens/movies/movie-detail-page";

type Props = { params: Promise<{ movieId: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { movieId } = await params;
  const movie = await getServerMovie(movieId);
  return {
    title: movie?.title ?? "영화 상세",
    description: movie?.overview || "영화 정보와 즐겨찾기, 나만의 평점을 확인하세요.",
    openGraph: {
      title: movie?.title ?? "UMCine 영화 상세",
      description: movie?.overview || "영화 정보와 나만의 평점",
      images: movie?.backdrop_path
        ? [`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`]
        : [],
    },
  };
}
export default async function Page({ params }: Props) {
  const { movieId } = await params;
  const movie = await getServerMovie(movieId);
  return <MovieDetailPage movieId={movieId} initialMovie={movie} />;
}
