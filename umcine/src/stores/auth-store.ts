import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

// 토큰은 클라이언트가 원본을 가진 값이라 Zustand(persist)로 관리해요.
// 회원 정보처럼 원본이 서버에 있는 값은 여기에 두지 않고 query 캐시(["members", "me"])로 관리해요.
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
