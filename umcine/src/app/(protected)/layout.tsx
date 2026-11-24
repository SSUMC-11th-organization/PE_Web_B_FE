import type { ReactNode } from "react";
import { AuthGuard } from "../../components/auth/auth-guard";

// (protected)는 URL에 포함되지 않는 라우트 그룹이에요. TanStack Router의 (protected)/route.tsx가 layout.tsx로 바뀌었어요.
// /my, /my/edit처럼 로그인 후에만 볼 수 있는 페이지는 이 폴더 안에 만들면 접근 제한이 함께 적용돼요.
// 페이지를 보는 중에 401로 토큰이 비워져도 AuthGuard가 다시 렌더링되며 /login으로 보내요.
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <AuthGuard allow="member">{children}</AuthGuard>;
}
