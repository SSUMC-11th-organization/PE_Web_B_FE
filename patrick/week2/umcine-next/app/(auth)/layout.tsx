"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

// 저장된 토큰을 브라우저에서 다 읽어 왔는지 알려줘요.
// 토큰은 localStorage에만 있어서 서버는 로그인 여부를 알 수 없고,
// 브라우저에서 읽어 온 뒤에야 확인할 수 있어요.
function subscribeHydration(onChange: () => void) {
  return useAuthStore.persist.onFinishHydration(onChange);
}

function getHydrated() {
  return useAuthStore.persist.hasHydrated();
}

function getServerHydrated() {
  return false;
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isHydrated = useSyncExternalStore(
    subscribeHydration,
    getHydrated,
    getServerHydrated,
  );
  const accessToken = useAuthStore((state) => state.accessToken);

  // 토큰을 다 읽어 왔는데도 없으면 로그인하지 않은 거라 /login으로 보내요
  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace("/login");
    }
  }, [isHydrated, accessToken, router]);

  if (!isHydrated || !accessToken) {
    return <main>로그인 상태를 확인하는 중이에요.</main>;
  }

  return <>{children}</>;
}
