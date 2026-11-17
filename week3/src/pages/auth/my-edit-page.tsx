import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { checkNicknameDuplicate } from "@/apis/members/check-nickname-duplicate";
import { useMeQuery } from "@/hooks/use-me-query";
import { useUpdateMeMutation } from "@/hooks/use-update-me-mutation";
import LoadingState from "@/components/status/loading-state";
import ErrorState from "@/components/status/error-state";
import { cn } from "@/utils/cn";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

const INPUT_BOX_CLASS = "flex h-12 items-center gap-3 rounded-lg border bg-surface px-4";

export function MyEditPage() {
  const meQuery = useMeQuery();

  if (meQuery.isPending) {
    return (
      <main className="flex flex-1 flex-col">
        <LoadingState message="내 정보를 불러오는 중이에요." />
      </main>
    );
  }

  if (meQuery.isError) {
    return (
      <main className="flex flex-1 flex-col">
        <ErrorState error={meQuery.error} onRetry={() => meQuery.refetch()} />
      </main>
    );
  }

  return <MyEditForm currentNickname={meQuery.data.nickname} email={meQuery.data.email} />;
}

interface MyEditFormProps {
  currentNickname: string;
  email: string;
}

function MyEditForm({ currentNickname, email }: MyEditFormProps) {
  const navigate = useNavigate();
  const updateMeMutation = useUpdateMeMutation();

  const [form, setForm] = useState({ nickname: currentNickname });
  // 중복 확인을 통과한 닉네임을 기억해요. 입력값이 이 값과 같아야 저장할 수 있어요.
  const [checkedNickname, setCheckedNickname] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null);

  const nickname = form.nickname.trim();
  const isNicknameValid = nickname.length >= 2 && nickname.length <= 12;
  const isNicknameChanged = nickname !== currentNickname;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const isNicknameChecked = checkedNickname === nickname;

  // 형식이 맞고, 기존 닉네임과 다르고, 중복 확인까지 통과해야 저장할 수 있어요.
  const canSubmit = isNicknameValid && isNicknameChanged && isNicknameChecked;

  const handleCheckDuplicate = async () => {
    if (!isNicknameValid || !isNicknameChanged || isChecking) return;

    setIsChecking(true);
    try {
      const response = await checkNicknameDuplicate(nickname);
      setCheckedNickname(response.available ? nickname : null);
      alert(response.available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch {
      setCheckedNickname(null);
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleChangeProfileImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      alert("프로필 이미지는 최대 5MB까지 올릴 수 있어요.");
      return;
    }

    if (profilePreviewUrl) URL.revokeObjectURL(profilePreviewUrl);
    setProfilePreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate(
      { nickname },
      // 저장에 성공하면 내 정보 화면에서 바뀐 닉네임을 확인해요.
      { onSuccess: () => navigate({ to: "/my" }) },
    );
  };

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-20 py-8">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold">내 정보 수정</h1>
            <p className="text-xs text-ink-2">닉네임과 프로필 이미지만 변경할 수 있어요.</p>
          </div>
          <button
            type="submit"
            disabled={!canSubmit || updateMeMutation.isPending}
            className="h-[42px] rounded-lg bg-primary px-4 text-sm font-extrabold text-white hover:bg-blue-700 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-primary"
          >
            {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-10">
          <div className="flex flex-col items-center gap-1.5 pt-1">
            <label className="relative cursor-pointer" aria-label="프로필 이미지 변경">
              <span className="flex size-[72px] items-center justify-center overflow-hidden rounded-full bg-line">
                {profilePreviewUrl ? (
                  <img src={profilePreviewUrl} alt="" className="size-full object-cover" />
                ) : (
                  <img src="/icons/movie-icons/person.svg" alt="" className="size-7" />
                )}
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full bg-surface">
                <img src="/icons/movie-icons/edit.svg" alt="" className="size-5" />
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleChangeProfileImage}
                className="sr-only"
              />
            </label>
            <p className="mt-1 text-sm font-bold">프로필 이미지</p>
            <p className="text-[11px] text-ink-3">선택 사항 · 최대 5MB</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="my-edit-nickname" className="text-[13px] font-bold">
                닉네임
              </label>
              <div
                className={cn(
                  INPUT_BOX_CLASS,
                  showNicknameError
                    ? "border-red-500"
                    : "border-line focus-within:border-primary",
                )}
              >
                <input
                  id="my-edit-nickname"
                  type="text"
                  value={form.nickname}
                  onChange={(e) => setForm({ nickname: e.target.value })}
                  disabled={isChecking || updateMeMutation.isPending}
                  placeholder="2-12자"
                  autoComplete="nickname"
                  aria-invalid={showNicknameError}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-3 disabled:text-ink-3"
                />
                <button
                  type="button"
                  onClick={handleCheckDuplicate}
                  disabled={!isNicknameValid || !isNicknameChanged || isChecking}
                  className="shrink-0 text-xs font-bold text-primary disabled:cursor-default disabled:opacity-40"
                >
                  {isChecking ? "확인 중" : isNicknameChecked ? "확인 완료" : "중복 확인"}
                </button>
              </div>
              {showNicknameError && (
                <p className="text-[11px] text-red-500">
                  닉네임은 2자 이상 12자 이하로 입력해 주세요.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="my-edit-email" className="text-[13px] font-bold">
                이메일
              </label>
              <input
                id="my-edit-email"
                type="email"
                value={email}
                readOnly
                className={cn(INPUT_BOX_CLASS, "border-line text-sm outline-none")}
              />
            </div>
          </div>
        </div>
      </form>

      <section className="mt-16 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-5 py-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-bold text-red-600">회원 탈퇴</h2>
          <p className="text-[11px] text-ink-2">
            탈퇴하면 계정과 즐겨찾기 정보가 모두 삭제되며 복구할 수 없어요.
          </p>
        </div>
        {/* 회원 탈퇴 API를 연결하면 onClick에 요청을 추가해요. */}
        <button
          type="button"
          className="h-9 rounded-lg border border-red-300 bg-surface px-3 text-xs font-bold text-red-600"
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}
