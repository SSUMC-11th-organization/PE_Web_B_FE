import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberRating } from "../api/members/models";
import { memberKeys } from "../api/members/queries";
import { ratingMutations } from "../api/mutations";

// 평점 변경 후 캐시를 갱신하는 방법을 요청마다 다르게 골랐어요.
// - 생성: ratingId · createdAt은 서버가 만들기 때문에 invalidateQueries로 다시 조회해요.
// - 수정: 요청에 보낸 score · comment로 setQueryData — 추가 GET 없이 바로 반영돼요.
// - 삭제: 지운 ratingId만 목록에서 빼면 되므로 setQueryData로 바로 반영해요.

export function useCreateRatingMutation(memberId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    ...ratingMutations.create(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.ratings(memberId) });
      alert("평점을 등록했어요.");
    },
    onError: () => {
      alert("평점을 등록하지 못했어요. 다시 시도해 주세요.");
    },
  });
}

export function useUpdateRatingMutation(memberId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    ...ratingMutations.update(),
    onSuccess: (_response, { ratingId, score, comment }) => {
      queryClient.setQueryData<MemberRating[]>(memberKeys.ratings(memberId), (prev) =>
        prev?.map((rating) =>
          rating.ratingId === ratingId
            ? { ...rating, score, comment, updatedAt: new Date().toISOString() }
            : rating,
        ),
      );
      alert("평점을 수정했어요.");
    },
    onError: () => {
      alert("평점을 수정하지 못했어요. 다시 시도해 주세요.");
    },
  });
}

export function useDeleteRatingMutation(memberId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    ...ratingMutations.remove(),
    onSuccess: (_response, ratingId) => {
      queryClient.setQueryData<MemberRating[]>(memberKeys.ratings(memberId), (prev) =>
        prev?.filter((rating) => rating.ratingId !== ratingId),
      );
      alert("평점을 삭제했어요.");
    },
    onError: () => {
      alert("평점을 삭제하지 못했어요. 다시 시도해 주세요.");
    },
  });
}
