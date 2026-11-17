const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL || "https://api.themoviedb.org/3";
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN || "";
export const env = {
  tmdbApiBaseUrl: tmdbApiBaseUrl.replace(/\/+$/, ""),
  tmdbAccessToken,
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || "https://workbook.devnoco.com/v8").replace(
    /\/+$/,
    "",
  ),
};
