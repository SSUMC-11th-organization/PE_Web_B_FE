import type { Metadata } from "next";
import { AuthGuard } from "../../components/auth/auth-guard";
import { LoginPage } from "../../screens/auth/login-page";

export const metadata: Metadata = { title: "로그인", description: "UMCine에 로그인해요." };

// 이미 로그인했다면 로그인 폼을 보여 주지 않고 홈으로 보내요. (기존 beforeLoad 역할)
export default function LoginRoute() {
  return (
    <AuthGuard allow="guest">
      <LoginPage />
    </AuthGuard>
  );
}
