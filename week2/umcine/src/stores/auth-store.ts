import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
    accessToken: string | null;
    /** 선택한 이미지의 미리보기 주소예요. 용량이 커서 localStorage에는 저장하지 않아요. */
    profileImageUrl: string | null;
    setAccessToken: (accessToken: string | null) => void;
    setProfileImageUrl: (profileImageUrl: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            accessToken: null,
            profileImageUrl: null,
            // 토큰이 바뀌면(로그아웃, 다른 계정 로그인) 이전 계정의 이미지는 지워요.
            setAccessToken: (accessToken) => set({ accessToken, profileImageUrl: null }),
            setProfileImageUrl: (profileImageUrl) => set({ profileImageUrl }),
        }),
        {
            name: "umcine-auth-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ accessToken: state.accessToken }),
        },
    ),
);
