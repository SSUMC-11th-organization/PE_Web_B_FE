import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { updateMe } from "../api/members/update-me";
import { errorMessage } from "../api/response";
import { useAuthStore } from "../stores/auth-store";
export function useUpdateMeMutation() {
  const client = useQueryClient();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.accessToken);
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (member) => {
      if (useAuthStore.getState().accessToken !== token) return;
      client.setQueryData(["members", "me"], member);
      void navigate({ to: "/profile" });
    },
    onError: async (error) => {
      window.alert(await errorMessage(error, "내 정보 수정에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
