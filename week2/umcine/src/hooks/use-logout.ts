import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { favoriteKeys, memberKeys } from "../api/query-keys";
import { useAuthStore } from "../stores/auth-store";

export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    return () => {
        setAccessToken(null);
        // 다른 계정으로 로그인했을 때 이전 계정의 정보가 보이지 않도록 캐시를 지워요.
        queryClient.removeQueries({ queryKey: memberKeys.me });
        queryClient.removeQueries({ queryKey: favoriteKeys.all });
        navigate({ to: "/" });
    };
}
