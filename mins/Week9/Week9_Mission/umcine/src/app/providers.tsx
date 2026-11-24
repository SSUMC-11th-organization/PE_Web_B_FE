"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode, useEffect, useState } from "react";
import { createQueryClient, queryClient } from "../lib/query-client";
import { useAuthStore } from "../stores/auth-store";
export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() =>
    typeof window === "undefined" ? createQueryClient() : queryClient,
  );
  useEffect(() => {
    void Promise.resolve(useAuthStore.persist.rehydrate()).finally(() =>
      useAuthStore.getState().setHasHydrated(true),
    );
  }, []);
  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
