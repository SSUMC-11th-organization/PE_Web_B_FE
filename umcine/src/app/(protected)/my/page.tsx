import type { Metadata } from "next";
import { MyPage } from "../../../screens/members/my-page";

export const metadata: Metadata = { title: "내 정보" };

// 로그인 여부는 브라우저의 localStorage에서만 알 수 있어서, AuthGuard가 확인을 마칠 때까지 이 페이지를 그리지 않아요.
// 즉시 이동(instant navigation) 검증 대상에서 빼 "막히는 이동"임을 명시해요.
export const instant = false;

export default function MyRoute() {
  return <MyPage />;
}
