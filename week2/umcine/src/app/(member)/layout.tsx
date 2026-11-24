import type { ReactNode } from "react";
import { AuthLayout } from "@/components/layout/auth-layout";

// (member) 폴더는 Route Group이라 주소에 포함되지 않아요.
// 이 layout 아래의 페이지는 로그인한 경우에만 볼 수 있어요.
export default function MemberLayout({ children }: { children: ReactNode }) {
    return <AuthLayout>{children}</AuthLayout>;
}
