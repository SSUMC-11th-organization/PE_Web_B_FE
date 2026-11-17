import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import type { MemberInfo } from "../../api/members/me";
import { primaryButtonClass } from "../../components/auth/button-styles";
import { FormField } from "../../components/auth/form-field";
import StatusMessage from "../../components/common/status-message";
import { useMeQuery } from "../../hooks/use-me";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { isValidNickname } from "../../utils/auth/validation";

export function MyEditPage() {
  const meQuery = useMeQuery();

  if (meQuery.isPending) {
    return (
      <main className="mx-auto max-w-[520px] px-4 py-16">
        <StatusMessage message="내 정보를 불러오는 중이에요." />
      </main>
    );
  }
  if (meQuery.isError) {
    return (
      <main className="mx-auto max-w-[520px] px-4 py-16">
        <StatusMessage message="내 정보를 불러오지 못했어요." onRetry={() => meQuery.refetch()} />
      </main>
    );
  }

  // 조회가 끝난 뒤에 폼을 그려야 입력칸의 초기값을 서버 값으로 채울 수 있어요.
  return <MyEditForm me={meQuery.data} />;
}

function MyEditForm({ me }: { me: MemberInfo }) {
  const navigate = useNavigate();
  const updateMeMutation = useUpdateMeMutation();
  const [form, setForm] = useState({ nickname: me.nickname });

  const nickname = form.nickname.trim();
  const isNicknameValid = isValidNickname(nickname);
  const isChanged = nickname !== me.nickname;
  const canSubmit = isChanged && isNicknameValid;

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate(
      { nickname },
      // 캐시 갱신과 alert는 훅에서 처리하고, 화면 이동만 이 화면에서 덧붙여요.
      { onSuccess: () => navigate({ to: "/my" }) },
    );
  };

  return (
    <main className="flex justify-center px-4 py-16">
      <div className="w-full max-w-[520px] rounded-2xl border border-border-default bg-bg-surface p-8">
        <h1 className="mb-8 text-[28px] font-bold tracking-[-1px] text-text-primary">내 정보 수정</h1>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit} noValidate>
          <FormField id="edit-email" label="이메일" value={me.email} disabled readOnly />

          <FormField
            id="edit-nickname"
            label="닉네임"
            placeholder="2~12자로 입력해 주세요"
            value={form.nickname}
            onChange={(e) => setForm({ nickname: e.target.value })}
            showError={!isNicknameValid}
            errorMessage="닉네임은 2자 이상 12자 이하로 입력해 주세요."
          />

          <div className="mt-2 flex gap-2">
            <Link
              className="flex h-12 flex-1 items-center justify-center rounded-[10px] border border-border-default text-sm font-bold text-text-secondary hover:bg-bg-page"
              to="/my"
            >
              취소
            </Link>
            <button
              className={`${primaryButtonClass} flex-1`}
              type="submit"
              disabled={!canSubmit || updateMeMutation.isPending}
            >
              {updateMeMutation.isPending ? "저장 중" : "저장"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
