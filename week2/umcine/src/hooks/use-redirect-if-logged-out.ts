"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useAuthStore } from "@/stores/auth-store";

function subscribeHydration(onChange: () => void) {
    return useAuthStore.persist.onFinishHydration(onChange);
}

// 로그인 정보가 localStorage에 있어서 서버에서는 알 수 없어요.
// 브라우저에서 저장된 상태를 불러온 뒤 로그아웃 상태면 로그인 화면으로 보내요.
export function useRedirectIfLoggedOut() {
    const router = useRouter();
    const member = useAuthStore((state) => state.member);
    const hasHydrated = useSyncExternalStore(
        subscribeHydration,
        () => useAuthStore.persist.hasHydrated(),
        () => false,
    );

    // TanStack Router의 beforeLoad처럼 화면에 들어올 때 한 번만 확인해요.
    // 탈퇴처럼 화면 안에서 로그아웃한 뒤 다른 곳으로 이동할 때는 로그인 화면으로 보내지 않아요.
    useEffect(() => {
        if (hasHydrated && !useAuthStore.getState().member) router.replace("/login");
    }, [hasHydrated, router]);

    return hasHydrated ? member : null;
}
