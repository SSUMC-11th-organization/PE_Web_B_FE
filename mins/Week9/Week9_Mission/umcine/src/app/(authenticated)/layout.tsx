import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthenticatedLayout } from "../../components/layout/authenticated-layout";
// 브라우저의 토큰 복원 전에는 하위 화면을 숨기므로 즉시 탐색 검증에서 제외한다.
export const instant = false;
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function Layout({ children }: { children: ReactNode }) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
