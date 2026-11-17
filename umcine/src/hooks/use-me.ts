import { useQuery } from "@tanstack/react-query";
import { memberQueries } from "../api/members/queries";
import { useAuthStore } from "../stores/auth-store";
import { getMemberIdFromToken } from "../utils/auth/jwt";

// 토큰이 있을 때만 내 정보를 조회해요. 헤더 · 마이페이지 · 수정 화면이 같은 캐시를 함께 써요.
export function useMeQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({ ...memberQueries.me(), enabled: Boolean(accessToken) });
}

// 평점 조회(GET /members/{memberId}/ratings)에 쓸 내 회원 번호예요.
export function useMyMemberId() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();
  return meQuery.data?.memberId ?? getMemberIdFromToken(accessToken);
}
