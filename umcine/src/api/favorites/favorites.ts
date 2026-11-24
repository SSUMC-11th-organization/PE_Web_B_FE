import { isHTTPError } from "ky";
import { authApi } from "../auth-api";
import { unwrapResult } from "../common";

interface Favorite {
  favoriteId?: number;
  movieId: number;
  createdAt?: string;
}

interface AddFavoriteRequest {
  movieId: number;
}

// 목록 응답이 배열이거나 { favorites: [...] } 같은 객체여도 배열로 맞춰요.
function toFavoriteList(result: unknown): Favorite[] {
  if (Array.isArray(result)) return result as Favorite[];
  if (typeof result === "object" && result !== null) {
    const list = Object.values(result).find(Array.isArray);
    if (list) return list as Favorite[];
  }
  return [];
}

// 상태 응답이 true/false 이거나 { favorited: true } 같은 객체여도 boolean으로 맞춰요.
function toFavoriteStatus(result: unknown): boolean {
  if (typeof result === "boolean") return result;
  if (typeof result === "object" && result !== null) {
    const flag = Object.values(result).find((value) => typeof value === "boolean");
    if (typeof flag === "boolean") return flag;
    // 즐겨찾기 정보 자체가 내려오면 추가된 상태예요.
    return "movieId" in result;
  }
  return false;
}

// GET /favorites — 내 즐겨찾기 목록
async function getFavorites(): Promise<Favorite[]> {
  const data = await authApi.get("favorites").json<unknown>();
  return toFavoriteList(unwrapResult(data));
}

// GET /favorites/{movieId} — 이 영화를 즐겨찾기했는지
async function getFavoriteStatus(movieId: number): Promise<boolean> {
  try {
    const data = await authApi.get(`favorites/${movieId}`).json<unknown>();
    return toFavoriteStatus(unwrapResult(data));
  } catch (error) {
    // 즐겨찾기하지 않은 영화를 404로 알려 주는 경우도 "추가 안 됨"으로 처리해요.
    if (isHTTPError(error) && error.response.status === 404) return false;
    throw error;
  }
}

// POST /favorites
function addFavorite(body: AddFavoriteRequest) {
  return authApi.post("favorites", { json: body }).json<unknown>();
}

// DELETE /favorites/{movieId}
async function removeFavorite(movieId: number) {
  await authApi.delete(`favorites/${movieId}`);
}

export { addFavorite, getFavorites, getFavoriteStatus, removeFavorite, type AddFavoriteRequest, type Favorite };
