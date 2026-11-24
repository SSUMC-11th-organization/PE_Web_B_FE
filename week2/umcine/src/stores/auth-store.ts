import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
    accessToken: string | null;
    /** 선택한 이미지의 미리보기 주소예요. 용량이 커서 localStorage에는 저장하지 않아요. */
    profileImageUrl: string | null;
    /** 로그아웃 버튼으로 토큰을 지운 경우예요. 이때는 로그인 화면 대신 로그아웃 후 이동할 화면으로 보내요. */
    isLoggingOut: boolean;
    setAccessToken: (accessToken: string | null) => void;
    setProfileImageUrl: (profileImageUrl: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            accessToken: null,
            profileImageUrl: null,
            isLoggingOut: false,
            // 토큰이 바뀌면(로그아웃, 다른 계정 로그인) 이전 계정의 이미지는 지워요.
            setAccessToken: (accessToken) => set({ accessToken, profileImageUrl: null, isLoggingOut: false }),
            setProfileImageUrl: (profileImageUrl) => set({ profileImageUrl }),
            logout: () => set({ accessToken: null, profileImageUrl: null, isLoggingOut: true }),
        }),
        {
            name: "umcine-auth-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ accessToken: state.accessToken }),
            // 서버 HTML과 첫 화면이 같도록 store를 만들 때 바로 불러오지 않고, Providers에서 hydration 뒤에 불러와요
            skipHydration: true,
        },
    ),
);
