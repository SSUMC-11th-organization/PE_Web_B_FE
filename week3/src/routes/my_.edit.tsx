import { createFileRoute, redirect } from "@tanstack/react-router";
import { MyEditPage } from "@/pages/auth/my-edit-page";
import { useAuthStore } from "@/stores/auth-store";

// 파일 이름의 my_는 /my 화면 안에 겹쳐 그리지 않고 별도 화면으로 보여준다는 뜻이에요.
export const Route = createFileRoute("/my_/edit")({
  // 로그인하지 않았으면 로그인 페이지로 보내요.
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: MyEditPage,
});
