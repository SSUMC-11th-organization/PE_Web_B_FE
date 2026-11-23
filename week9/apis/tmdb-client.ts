import ky from "ky";
import { env } from "@/config/env";

export const TMDB_BASE_URL = "https://api.themoviedb.org/3/";

export const tmdbClient = ky.create({
  baseUrl: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },
  searchParams: { language: "ko-KR" },
});
