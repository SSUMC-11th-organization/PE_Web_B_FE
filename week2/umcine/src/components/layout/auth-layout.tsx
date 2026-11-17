import { Navigate, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

// 로그인 후에만 볼 수 있는 페이지들의 공통 Layout이에요.
export function AuthLayout() {
    const accessToken = useAuthStore((state) => state.accessToken);

    // 페이지를 보는 중에 토큰이 만료돼(401) 지워지면 로그인 화면으로 보내요.
    if (!accessToken) return <Navigate to="/login" />;

    return <Outlet />;
}
