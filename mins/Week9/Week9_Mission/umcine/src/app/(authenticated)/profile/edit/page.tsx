// 토큰 복원과 인증 확인 후에만 표시하는 화면이다.
export const instant = false;

import type { Metadata } from "next";
import { ProfileEditPage } from "../../../../screens/profile/profile-edit-page";
export const metadata: Metadata = { title: "내 정보 수정" };
export default function Page() {
  return <ProfileEditPage />;
}
