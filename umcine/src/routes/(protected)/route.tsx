import { createFileRoute, Navigate, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

// (protected)는 URL에 포함되지 않는 route group이에요. 이 route.tsx는 그룹 안 모든 페이지의 공통 Layout Route예요.
// /my, /my/edit처럼 로그인 후에만 볼 수 있는 페이지는 이 폴더 안에 만들면 접근 제한이 함께 적용돼요.
export const Route = createFileRoute("/(protected)")({
  beforeLoad: () => {
    // 페이지를 그리기 전에 토큰이 없으면 로그인 페이지로 보내요.
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);

  // 페이지를 보는 중에 401로 토큰이 비워지면(만료 등) 로그인 페이지로 보내요.
  if (!accessToken) return <Navigate to="/login" />;

  return <Outlet />;
}
