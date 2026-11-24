import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signup } from "../api/members/signup";
import { errorMessage } from "../api/response";
export function useSignupMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      window.alert(response.message);
      router.push("/login");
    },
    onError: async (error) => {
      window.alert(await errorMessage(error, "회원가입에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
