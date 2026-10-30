import ky from "ky";

export const TMDB_BASE_URL = "https://api.themoviedb.org/3/";

export const tmdbClient = ky.create({
  baseUrl: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
  },
  searchParams: { language: "ko-KR" },
});
