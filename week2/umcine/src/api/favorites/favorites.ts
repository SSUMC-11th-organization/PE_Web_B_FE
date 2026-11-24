import { authApi } from "../auth-api";
import type { ApiResponse } from "../types";

export interface Favorite {
    favoriteId: number;
    movieId: number;
    createdAt: string;
}

// GET /favorites: 내 즐겨찾기 목록
export async function getFavorites(): Promise<Favorite[]> {
    const response = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
    return response.result;
}

// GET /favorites/{movieId}: 이 영화를 즐겨찾기했는지
export async function getFavoriteStatus(movieId: number): Promise<boolean> {
    const response = await authApi
        .get(`favorites/${movieId}`)
        .json<ApiResponse<{ isFavorite: boolean }>>();
    return response.result.isFavorite;
}

// POST /favorites
export async function addFavorite(movieId: number): Promise<Favorite> {
    const response = await authApi
        .post("favorites", { json: { movieId } })
        .json<ApiResponse<Favorite>>();
    return response.result;
}

// DELETE /favorites/{movieId}
export async function removeFavorite(movieId: number): Promise<void> {
    await authApi.delete(`favorites/${movieId}`);
}
