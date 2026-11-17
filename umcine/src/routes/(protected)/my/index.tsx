import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../../../pages/members/my-page";

// 접근 제한은 상위 (protected)/route.tsx의 beforeLoad가 맡아요.
export const Route = createFileRoute("/(protected)/my/")({ component: MyPage });
