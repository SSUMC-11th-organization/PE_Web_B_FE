import { apiClient } from "../api-client";
import { authApi } from "../auth-api";
import type { ApiResponse } from "../types";

export interface Rating {
    ratingId: number;
    movieId: number;
    score: number;
    comment: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRatingRequest {
    movieId: number;
    score: number;
    comment?: string;
}

export interface UpdateRatingRequest {
    score: number;
    comment?: string;
}

// GET /members/{memberId}/ratings: 공통 응답 없이 배열을 그대로 내려줘요. 인증이 필요 없어요.
export function getMemberRatings(memberId: number) {
    return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}

// POST /ratings
export async function createRating(body: CreateRatingRequest): Promise<Rating> {
    const response = await authApi.post("ratings", { json: body }).json<ApiResponse<Rating>>();
    return response.result;
}

// PATCH /ratings/{ratingId}
export async function updateRating(ratingId: number, body: UpdateRatingRequest): Promise<Rating> {
    const response = await authApi
        .patch(`ratings/${ratingId}`, { json: body })
        .json<ApiResponse<Rating>>();
    return response.result;
}

// DELETE /ratings/{ratingId}
export async function deleteRating(ratingId: number): Promise<void> {
    await authApi.delete(`ratings/${ratingId}`);
}
