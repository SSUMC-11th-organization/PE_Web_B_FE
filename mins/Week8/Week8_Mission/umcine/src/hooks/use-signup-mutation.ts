import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signup } from "../api/members/signup";
import { errorMessage } from "../api/response";
export function useSignupMutation() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      window.alert(response.message);
      void navigate({ to: "/login" });
    },
    onError: async (error) => {
      window.alert(await errorMessage(error, "회원가입에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
