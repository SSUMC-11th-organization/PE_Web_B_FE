import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { errorMessage } from "../api/response";
import { clearPrivateQueries } from "../lib/query-client";
import { useAuthStore } from "../stores/auth-store";
export function useLoginMutation() {
  const client = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: login,
    onSuccess: async (result) => {
      clearPrivateQueries();
      useAuthStore.getState().setAccessToken(result.accessToken);
      await client.invalidateQueries({ queryKey: ["members", "me"] });
      void navigate({ to: "/" });
    },
    onError: async (error) => {
      window.alert(await errorMessage(error, "로그인에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
