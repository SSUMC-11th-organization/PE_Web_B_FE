import { cache } from "react";
import { getMovieDetail } from "../api/movies/get-movie-detail";

// 상세 HTML과 메타데이터는 같은 요청에서 공개 영화 조회 결과를 재사용한다.
// 회원 토큰이나 회원별 데이터는 이 서버 조회에 전달하지 않는다.
export const getServerMovie = cache(async (movieId: string) => {
  const id = Number(movieId);
  if (!Number.isSafeInteger(id) || id <= 0) return undefined;
  return getMovieDetail(id).catch(() => undefined);
});
