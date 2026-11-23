"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@/stores/auth-store";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useViewSettingsStore } from "@/stores/view-settings-store";

const ONE_MINUTE = 60 * 1000;

export function Providers({ children }: { children: ReactNode }) {
  // QueryClient는 컴포넌트가 처음 만들어질 때 한 번만 만들어요
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: ONE_MINUTE } },
      }),
  );

  // 저장된 값(토큰, 북마크, 카드 크기)은 localStorage에 있어서
  // 브라우저에서 화면이 뜬 뒤에 읽어 와요
  useEffect(() => {
    useAuthStore.persist.rehydrate();
    useBookmarkStore.persist.rehydrate();
    useViewSettingsStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
