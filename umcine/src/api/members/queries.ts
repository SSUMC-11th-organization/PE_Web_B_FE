import { queryOptions } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import { getMemberRatings } from "./get-member-ratings";
import { getMe } from "./me";

const memberKeys = {
  all: ["members"] as const,
  me: () => [...memberKeys.all, "me"] as const,
  ratings: (memberId: number) => [...memberKeys.all, memberId, "ratings"] as const,
};

const memberQueries = {
  me: () =>
    queryOptions({
      queryKey: memberKeys.me(),
      queryFn: getMe,
      // 내 정보는 자주 바뀌지 않아요.
      staleTime: 5 * 60 * 1000,
      // 401로 토큰을 비운 뒤 같은 요청을 다시 보내지 않도록 재시도를 꺼요.
      retry: false,
    }),

  ratings: (memberId: number | null) =>
    queryOptions({
      queryKey: memberKeys.ratings(memberId ?? 0),
      queryFn: () => getMemberRatings(memberId!),
      enabled: memberId !== null && memberId > 0,
      retry: (failureCount, error) =>
        !(isHTTPError(error) && [401, 404].includes(error.response.status)) && failureCount < 2,
    }),
};

export { memberKeys, memberQueries };
