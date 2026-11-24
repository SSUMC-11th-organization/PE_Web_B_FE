import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { memberKeys } from "../api/members/queries";
import { authMutations } from "../api/mutations";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    ...authMutations.login(),
    onSuccess: (response) => {
      setAccessToken(response.result.accessToken);
      alert("로그인에 성공했어요.");
      // 로그인한 사용자가 바뀌었으니 staleTime이 남아 있어도 내 정보를 다시 조회하게 해요.
      queryClient.invalidateQueries({ queryKey: memberKeys.me() });
      router.push("/");
    },
    onError: () => {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
