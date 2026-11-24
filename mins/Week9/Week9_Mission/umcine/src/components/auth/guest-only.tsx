"use client";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useAuthStore } from "../../stores/auth-store";
export function GuestOnly({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();
  useEffect(() => {
    if (hydrated && token) router.replace("/");
  }, [hydrated, token, router]);
  if (!hydrated || token)
    return (
      <main className="auth-main" role="status">
        로그인 상태를 확인하는 중이에요.
      </main>
    );
  return children;
}
