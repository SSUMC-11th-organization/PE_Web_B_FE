"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../../stores/auth-store";

interface AuthGuardProps {
  children: ReactNode;
  // "member": 로그인해야 볼 수 있는 페이지(/my), "guest": 로그인 전에만 볼 수 있는 페이지(/login)
  allow: "member" | "guest";
}

// TanStack Router의 beforeLoad + redirect를 대신해요.
// 토큰은 브라우저 localStorage에만 있어서 서버는 로그인 여부를 알 수 없으므로, 브라우저에서 확인한 뒤 이동시켜요.
export function AuthGuard({ children, allow }: AuthGuardProps) {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isLoggedIn = useAuthStore((state) => Boolean(state.accessToken));
  const isAllowed = allow === "member" ? isLoggedIn : !isLoggedIn;

  useEffect(() => {
    // 토큰을 읽기 전에는 판단하지 않아요. 읽기 전에 이동시키면 로그인한 사용자도 /login으로 튕겨요.
    if (!hasHydrated || isAllowed) return;
    router.replace(allow === "member" ? "/login" : "/");
  }, [allow, hasHydrated, isAllowed, router]);

  if (!hasHydrated || !isAllowed) return null;
  return children;
}
