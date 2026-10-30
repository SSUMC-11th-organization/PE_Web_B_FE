import { TMDB_BASE_URL } from "./tmdb-client";
import type { TmdbMovie, TmdbPagedResponse } from "../types/movie";

// ky 없이 순수 fetch로 인기 영화를 요청해요. (Network 패널 확인용)
export async function fetchPopularMoviesWithFetch() {
  const url = new URL("movie/popular", TMDB_BASE_URL);
  url.searchParams.set("language", "ko-KR");
  url.searchParams.set("page", "1");

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
    },
  });

  // fetch는 4xx, 5xx 응답에서도 reject 되지 않으므로 직접 확인해야 해요.
  if (!response.ok) {
    throw new Error(`인기 영화 요청 실패: ${response.status}`);
  }

  return (await response.json()) as TmdbPagedResponse<TmdbMovie>;
}
