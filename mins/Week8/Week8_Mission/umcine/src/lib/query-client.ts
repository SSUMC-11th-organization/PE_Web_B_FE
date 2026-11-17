import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, gcTime: 5 * 60_000 },
    mutations: { retry: false },
  },
});

export function clearPrivateQueries() {
  // 영화 캐시는 유지하고 사용자별 데이터와 진행 중인 조회만 비운다.
  for (const key of ["members", "favorites", "ratings"]) {
    void queryClient.cancelQueries({ queryKey: [key] });
    queryClient.removeQueries({ queryKey: [key] });
  }
}
