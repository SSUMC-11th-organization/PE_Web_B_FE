import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/auth-layout";
import { useAuthStore } from "@/stores/auth-store";

// (member) 폴더는 Route Group이라 주소에 포함되지 않아요.
// _auth는 주소 없이 하위 페이지를 감싸는 Layout Route예요. 로그인 후에만 볼 수 있는 페이지를 이 아래에 둬요.
export const Route = createFileRoute("/(member)/_auth")({
    beforeLoad: () => {
        if (!useAuthStore.getState().accessToken) {
            throw redirect({ to: "/login" });
        }
    },
    component: AuthLayout,
});
