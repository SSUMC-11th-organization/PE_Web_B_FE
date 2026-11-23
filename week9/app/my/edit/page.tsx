import { MyEdit } from "@/components/my/my-edit-form";
import { ResetOnLeave } from "@/components/reset-on-leave";

// RequireAuth가 로그인 확인 전에는 화면을 그리지 않으므로 즉시 이동 검증에서 제외해요.
export const instant = false;

export default function MyEditPage() {
  return (
    <ResetOnLeave>
      <MyEdit />
    </ResetOnLeave>
  );
}
