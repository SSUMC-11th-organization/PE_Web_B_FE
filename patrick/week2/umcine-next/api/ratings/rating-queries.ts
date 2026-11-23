import { queryOptions } from "@tanstack/react-query";
import { getMemberRatings } from "../members/get-member-ratings";

export const ratingQueries = {
  // 회원별 평점 목록. 영화 상세에서는 여기서 이 영화의 내 평점을 찾아요.
  byMember: (memberId: number) =>
    queryOptions({
      queryKey: ["ratings", "member", memberId],
      queryFn: () => getMemberRatings(memberId),
    }),
};
