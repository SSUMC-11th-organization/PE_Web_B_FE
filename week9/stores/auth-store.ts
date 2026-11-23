import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createBrowserStorage } from "@/utils/browser-storage";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      storage: createBrowserStorage(),
      // 서버 HTML과 첫 렌더링 결과가 같도록, 저장된 값은 Providers에서 나중에 불러와요.
      skipHydration: true,
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
