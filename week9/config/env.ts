// ky의 baseUrl은 끝에 /가 있어야 "members/..."처럼 상대 경로가 뒤에 이어 붙어요.
const withTrailingSlash = (url: string) => (url.endsWith("/") ? url : `${url}/`);

const required = (name: string, value: string | undefined) => {
  if (!value) throw new Error(`환경 변수 ${name} 값이 없어요. .env.local을 확인해 주세요.`);
  return value;
};

// NEXT_PUBLIC_ 값은 빌드할 때 문자열로 치환되므로 process.env.이름 전체를 그대로 적어야 해요.
export const env = {
  apiBaseUrl: withTrailingSlash(
    required("NEXT_PUBLIC_API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL),
  ),
  tmdbAccessToken: required(
    "NEXT_PUBLIC_TMDB_ACCESS_TOKEN",
    process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
  ),
};
