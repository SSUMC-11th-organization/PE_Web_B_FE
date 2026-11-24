import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { memberKeys } from "../api/query-keys";
import { useAuthStore } from "../stores/auth-store";

export function useMeQuery() {
    const accessToken = useAuthStore((state) => state.accessToken);

    return useQuery({
        queryKey: memberKeys.me,
        queryFn: getMe,
        enabled: Boolean(accessToken),
        staleTime: 5 * 60 * 1000,
        // 401이면 토큰을 지우므로 같은 요청을 다시 보내지 않아요.
        retry: false,
    });
}
