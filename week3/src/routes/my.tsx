import { createFileRoute, redirect } from "@tanstack/react-router";
import { MyPage } from "@/pages/auth/my-page";
import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute("/my")({
  // 로그인하지 않았으면 로그인 페이지로 보내요.
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: MyPage,
});
