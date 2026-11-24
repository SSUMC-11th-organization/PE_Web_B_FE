import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authMutations } from "../api/mutations";

// 7주차 try 안의 성공 처리는 onSuccess로, catch 안의 실패 처리는 onError로 옮겼어요.
export function useSignupMutation() {
  const router = useRouter();

  return useMutation({
    ...authMutations.signup(),
    onSuccess: (response) => {
      alert(response.message);
      router.push("/login");
    },
    onError: () => {
      // 실패하면 입력값을 유지한 채 다시 요청할 수 있어요.
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
