// 토큰 복원과 인증 확인 후에만 표시하는 화면이다.
export const instant = false;

import { redirect } from "next/navigation";
export default function Page() {
  redirect("/profile");
}
