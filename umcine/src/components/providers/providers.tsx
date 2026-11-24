"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "../../stores/auth-store";

const ONE_MINUTE = 60 * 1000;

// QueryClientProvider는 React Context를 쓰기 때문에 Client Component에서만 사용할 수 있어요.
// layout.tsx(Server Component)는 이 컴포넌트로 children을 감싸기만 해요.
export function Providers({ children }: { children: ReactNode }) {
  // 모듈 최상단에서 만들면 서버에서 여러 사용자의 요청이 같은 캐시를 공유할 수 있어요.
  // useState로 만들어 컴포넌트마다 하나의 QueryClient만 생기게 해요.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // 조회한 지 1분이 지나지 않은 데이터는 다시 요청하지 않아요.
        defaultOptions: { queries: { staleTime: ONE_MINUTE } },
      }),
  );

  // useEffect는 브라우저에서만 실행돼요. hydration이 끝난 뒤 localStorage의 토큰을 읽어요.
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
