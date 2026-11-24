"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthHydrated } from "../../hooks/use-auth-hydrated";
import { useAuthStore } from "../../stores/auth-store";

// 이미 로그인했다면 로그인, 회원가입 화면 대신 홈으로 보내요.
// 토큰의 유효성은 내 정보 API가 확인해요.
export function GuestOnly({ children }: { children: ReactNode }) {
    const router = useRouter();
    const isHydrated = useAuthHydrated();
    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {
        if (isHydrated && accessToken) router.replace("/");
    }, [isHydrated, accessToken, router]);

    if (isHydrated && accessToken) return null;

    return children;
}
