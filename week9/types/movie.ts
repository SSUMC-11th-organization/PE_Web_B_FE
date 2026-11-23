// 화면에서 사용하는 영화 데이터
export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterUrl: string | null;
  overview: string;
}

export interface MovieDetail extends Movie {
  backdropUrl: string | null;
  genres: string[];
  runtime: string;
  tagline: string;
}

// TMDB API 응답 데이터
export interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
}

export interface TmdbMovieDetail extends TmdbMovie {
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string;
}

export interface TmdbPagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
