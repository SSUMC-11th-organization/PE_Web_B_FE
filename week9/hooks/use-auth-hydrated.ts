import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/stores/auth-store";

const subscribe = (onChange: () => void) => useAuthStore.persist.onFinishHydration(onChange);
const getSnapshot = () => useAuthStore.persist.hasHydrated();
const getServerSnapshot = () => false;

// localStorage에서 토큰을 읽어왔는지 알려줘요. 읽기 전의 null을 로그아웃으로 오해하지 않게 해요.
export function useAuthHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
