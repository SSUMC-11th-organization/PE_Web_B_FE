"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";

// 이미 로그인한 사용자가 로그인 화면에 들어오면 영화 목록으로 보내요.
export function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isHydrated = useAuthHydrated();

  // 화면에 들어올 때만 확인해요. 로그인 직후의 이동은 useLoginMutation이 처리해요.
  useEffect(() => {
    if (isHydrated && useAuthStore.getState().accessToken) router.replace("/");
  }, [isHydrated, router]);

  return children;
}
