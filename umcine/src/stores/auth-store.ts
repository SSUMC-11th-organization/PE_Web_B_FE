import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  // localStorage에서 토큰을 다 읽어 왔는지 여부예요. 읽기 전에는 "로그인 안 됨"과 구분해야 해요.
  hasHydrated: boolean;
  setAccessToken: (accessToken: string | null) => void;
}

// 토큰은 클라이언트가 원본을 가진 값이라 Zustand(persist)로 관리해요.
// 회원 정보처럼 원본이 서버에 있는 값은 여기에 두지 않고 query 캐시(["members", "me"])로 관리해요.
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      hasHydrated: false,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
      // 서버에는 localStorage가 없어서 서버 HTML은 항상 "토큰 없음"으로 그려져요.
      // 브라우저가 첫 렌더부터 토큰을 읽으면 서버 HTML과 달라져 hydration 오류가 나므로,
      // 자동으로 읽지 않고 hydration이 끝난 뒤 Providers의 useEffect에서 rehydrate()를 호출해요.
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true });
      },
    },
  ),
);
