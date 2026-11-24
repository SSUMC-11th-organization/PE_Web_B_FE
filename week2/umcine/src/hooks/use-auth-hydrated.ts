"use client";

import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/stores/auth-store";

function subscribe(onChange: () => void) {
    return useAuthStore.persist.onFinishHydration(onChange);
}

// 로그인 토큰은 localStorage에 있어서 서버와 첫 렌더링에서는 알 수 없어요.
// 브라우저에서 저장된 토큰을 불러왔는지 알려 줘요. 서버에서는 항상 false예요.
export function useAuthHydrated() {
    return useSyncExternalStore(
        subscribe,
        () => useAuthStore.persist.hasHydrated(),
        () => false,
    );
}
