"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function Providers({ children }: { children: ReactNode }) {
    // 모듈 최상단에서 만들면 서버에서 여러 요청이 같은 캐시를 공유하게 돼서 컴포넌트 안에서 한 번만 만들어요
    const [queryClient] = useState(() => new QueryClient());

    // localStorage는 브라우저에만 있어서, 화면이 hydration된 뒤에 저장된 상태를 불러와요
    useEffect(() => {
        void useAuthStore.persist.rehydrate();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
