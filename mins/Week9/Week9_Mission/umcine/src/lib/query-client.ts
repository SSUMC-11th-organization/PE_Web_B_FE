import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, gcTime: typeof window === "undefined" ? Infinity : 5 * 60_000 },
      mutations: { retry: false },
    },
  });
}

// 브라우저 이벤트와 인증 API에서 공유한다. 서버 Provider는 요청별 인스턴스를 사용한다.
export const queryClient = createQueryClient();

export function clearPrivateQueries() {
  // 영화 캐시는 유지하고 사용자별 데이터와 진행 중인 조회만 비운다.
  for (const key of ["members", "favorites", "ratings"]) {
    void queryClient.cancelQueries({ queryKey: [key] });
    queryClient.removeQueries({ queryKey: [key] });
  }
}
