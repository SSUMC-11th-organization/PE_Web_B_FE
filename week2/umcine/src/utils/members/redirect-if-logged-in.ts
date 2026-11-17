import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

// 이미 로그인했다면 로그인, 회원가입 화면 대신 홈으로 보내요.
// 토큰의 유효성은 내 정보 API가 확인해요.
export function redirectIfLoggedIn() {
    if (useAuthStore.getState().accessToken) {
        throw redirect({ to: "/" });
    }
}
