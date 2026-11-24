export const env = {
  tmdbApiBaseUrl: (
    process.env.NEXT_PUBLIC_TMDB_API_BASE_URL || "https://api.themoviedb.org/3"
  ).replace(/\/+$/, ""),
  tmdbAccessToken: process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN || "",
  apiBaseUrl: (process.env.NEXT_PUBLIC_API_BASE_URL || "https://workbook.devnoco.com/v8").replace(
    /\/+$/,
    "",
  ),
};
