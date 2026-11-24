// Next.js는 NEXT_PUBLIC_ 접두사가 붙은 환경 변수만 브라우저 번들에 넣어 줘요.
// 빌드할 때 문자열로 치환되도록 process.env.NEXT_PUBLIC_* 를 그대로 적어야 해요.
const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const backendApiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

if (!backendApiBaseUrl) {
  throw new Error("백엔드 환경 변수가 필요해요.");
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  backendApiBaseUrl,
};
