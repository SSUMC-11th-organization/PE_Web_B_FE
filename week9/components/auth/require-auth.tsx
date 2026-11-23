"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/status/loading-state";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";

// 토큰이 localStorage에 있어 서버에서는 로그인 여부를 알 수 없으므로 브라우저에서 확인해요.
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isHydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const shouldRedirect = isHydrated && !accessToken;

  useEffect(() => {
    if (shouldRedirect) router.replace("/login");
  }, [shouldRedirect, router]);

  if (!isHydrated || !accessToken) {
    return (
      <main className="flex flex-1 flex-col">
        <LoadingState message="로그인 정보를 확인하는 중이에요." />
      </main>
    );
  }

  return children;
}
