import { RequireAuth } from "@/components/auth/require-auth";

// /my와 /my/edit은 로그인한 사용자만 볼 수 있어요. (TanStack Router의 beforeLoad 역할)
export default function MyLayout({ children }: LayoutProps<"/my">) {
  return <RequireAuth>{children}</RequireAuth>;
}
