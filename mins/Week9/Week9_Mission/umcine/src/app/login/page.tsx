import type { Metadata } from "next";
import { GuestOnly } from "../../components/auth/guest-only";
import { LoginPage } from "../../screens/auth/login-page";
export const instant = false;
export const metadata: Metadata = { title: "로그인", robots: { index: false } };
export default function Page() {
  return (
    <GuestOnly>
      <LoginPage />
    </GuestOnly>
  );
}
