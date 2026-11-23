// Next.js에서는 브라우저에서도 읽어야 하는 환경변수에 NEXT_PUBLIC_ 접두사를 붙여요.
// 값은 process.env.이름 형태로 "그대로" 적어야 빌드할 때 값으로 바뀌어 들어가요.
const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  apiBaseUrl,
};
