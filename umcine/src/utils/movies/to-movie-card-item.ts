import type { TmdbMovieListItem } from "../../api/movies/models";
import type { MovieCardItem } from "../../types/movie";
import { getTmdbPosterUrl } from "./tmdb-image";

// TMDB 목록 응답(snake_case)을 영화 카드 UI 타입(camelCase)으로 바꿔요.
export function toMovieCardItem(movie: TmdbMovieListItem): MovieCardItem {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date || "개봉일 정보 없음",
    posterUrl: getTmdbPosterUrl(movie.poster_path),
    overview: movie.overview || "줄거리 정보가 없어요.",
  };
}
