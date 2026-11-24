import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberInfo } from "../api/members/me";
import { memberKeys } from "../api/members/queries";
import { memberMutations } from "../api/mutations";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...memberMutations.updateMe(),
    onSuccess: (response) => {
      // 응답에 수정된 내 정보가 담겨 있으니 다시 조회하지 않고 캐시를 직접 바꿔요(setQueryData).
      // 응답에 memberId가 없을 수 있어서 기존 캐시 값과 합쳐요.
      queryClient.setQueryData<MemberInfo>(memberKeys.me(), (prev) => ({
        ...prev,
        ...response.result,
      }));
      alert("내 정보 수정에 성공했어요.");
    },
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
