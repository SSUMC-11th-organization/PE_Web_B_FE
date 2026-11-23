"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@/stores/auth-store";
import { useBookmarkStore } from "@/stores/bookmark-store";

const ONE_MINUTE = 60 * 1000;

export function Providers({ children }: { children: ReactNode }) {
  // 모듈 전역에 만들면 서버에서 여러 사용자의 요청이 캐시를 공유하므로 컴포넌트 안에서 만들어요.
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: ONE_MINUTE } } }),
  );

  // localStorage는 브라우저에만 있으므로 하이드레이션이 끝난 뒤에 저장된 상태를 불러와요.
  useEffect(() => {
    useAuthStore.persist.rehydrate();
    useBookmarkStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
