import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createRating,
    deleteRating,
    getMemberRatings,
    updateRating,
    type CreateRatingRequest,
    type Rating,
    type UpdateRatingRequest,
} from "../api/ratings/ratings";
import { ratingKeys } from "../api/query-keys";
import { getApiErrorMessage } from "../api/get-api-error-message";

export function useMemberRatingsQuery(memberId: number | null) {
    return useQuery({
        queryKey: ratingKeys.byMember(memberId ?? 0),
        queryFn: () => getMemberRatings(memberId!),
        enabled: memberId !== null,
    });
}

// 평점 등록/수정/삭제 응답으로 내 평점 목록 캐시를 직접 바꿔요. 다시 조회할 필요가 없어요.
export function useRatingMutations(memberId: number) {
    const queryClient = useQueryClient();
    const queryKey = ratingKeys.byMember(memberId);

    const createMutation = useMutation({
        mutationFn: (body: CreateRatingRequest) => createRating(body),
        onSuccess: (rating) => {
            queryClient.setQueryData<Rating[]>(queryKey, (ratings = []) => [...ratings, rating]);
        },
        onError: (error) => {
            alert(getApiErrorMessage(error, "평점을 등록하지 못했어요. 다시 시도해 주세요."));
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ ratingId, body }: { ratingId: number; body: UpdateRatingRequest }) =>
            updateRating(ratingId, body),
        onSuccess: (rating) => {
            queryClient.setQueryData<Rating[]>(queryKey, (ratings = []) =>
                ratings.map((item) => (item.ratingId === rating.ratingId ? rating : item)),
            );
        },
        onError: (error) => {
            alert(getApiErrorMessage(error, "평점을 수정하지 못했어요. 다시 시도해 주세요."));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (ratingId: number) => deleteRating(ratingId),
        onSuccess: (_, ratingId) => {
            queryClient.setQueryData<Rating[]>(queryKey, (ratings = []) =>
                ratings.filter((item) => item.ratingId !== ratingId),
            );
        },
        onError: (error) => {
            alert(getApiErrorMessage(error, "평점을 삭제하지 못했어요. 다시 시도해 주세요."));
        },
    });

    return { createMutation, updateMutation, deleteMutation };
}
