"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthHydrated } from "../../hooks/use-auth-hydrated";
import { useAuthStore } from "../../stores/auth-store";

// 로그인 후에만 볼 수 있는 페이지들의 공통 Layout이에요.
// 토큰이 localStorage에 있어서 서버에서는 확인할 수 없으므로 브라우저에서 확인해요.
export function AuthLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const isHydrated = useAuthHydrated();
    const accessToken = useAuthStore((state) => state.accessToken);
    const isLoggingOut = useAuthStore((state) => state.isLoggingOut);

    // 처음 들어왔을 때 토큰이 없거나, 페이지를 보는 중에 토큰이 만료돼(401) 지워지면 로그인 화면으로 보내요.
    // 로그아웃 버튼을 누른 경우에는 useLogout이 홈으로 보내므로 여기서는 이동하지 않아요.
    useEffect(() => {
        if (isHydrated && !accessToken && !isLoggingOut) router.replace("/login");
    }, [isHydrated, accessToken, isLoggingOut, router]);

    if (!isHydrated || !accessToken) return null;

    return children;
}
