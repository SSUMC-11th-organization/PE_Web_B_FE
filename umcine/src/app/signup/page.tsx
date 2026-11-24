import type { Metadata } from "next";
import { SignupPage } from "../../screens/auth/signup-page";

export const metadata: Metadata = {
  title: "회원가입",
  description: "UMCine 회원이 되어 즐겨찾기와 평점을 남겨요.",
};

export default function SignupRoute() {
  return <SignupPage />;
}
