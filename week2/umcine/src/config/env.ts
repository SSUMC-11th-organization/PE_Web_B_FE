// NEXT_PUBLIC_ 변수는 빌드할 때 값이 코드에 들어가서 브라우저에서도 읽을 수 있어요.
const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
    throw new Error("TMDB 환경 변수가 필요해요.");
}

export const env = {
    tmdbApiBaseUrl,
    tmdbAccessToken,
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
};
