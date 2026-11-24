import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/apis/members/me";
import { useAuthStore } from "@/stores/auth-store";

// 헤더, 내 정보, 내 정보 수정 화면이 같은 캐시를 함께 써요.
export function useMeQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
