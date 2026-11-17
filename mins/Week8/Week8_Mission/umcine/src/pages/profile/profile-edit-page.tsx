import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { type SubmitEvent, useState } from "react";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { type MemberInfo, memberQueries } from "../../api/members/me";
import { errorMessage } from "../../api/response";
import { FormField } from "../../components/auth/form-field";
import { ProfileAvatar } from "../../components/auth/profile-avatar";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { useAuthStore } from "../../stores/auth-store";
import { isNicknameValid } from "../../utils/member-validation";
export function ProfileEditPage() {
  const token = useAuthStore((state) => state.accessToken);
  const { data: member } = useQuery(memberQueries.me(token));
  return member ? <ProfileEditForm key={member.email} member={member} /> : null;
}
function ProfileEditForm({ member }: { member: MemberInfo }) {
  const [nickname, setNickname] = useState(member.nickname);
  const [message, setMessage] = useState("");
  const update = useUpdateMeMutation();
  const duplicate = useMutation({
    mutationFn: checkNicknameDuplicate,
    onSuccess: (response) =>
      setMessage(
        response.available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.",
      ),
    onError: async (error) => setMessage(await errorMessage(error)),
  });
  const disabled = update.isPending || duplicate.isPending;
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isNicknameValid(nickname) || disabled) return;
    update.mutate({ nickname: nickname.trim() });
  }
  return (
    <main className="profile-main profile-edit-main">
      <section className="profile-content" aria-labelledby="edit-title">
        <form className="profile-edit-form" onSubmit={handleSubmit} noValidate>
          <div className="profile-heading">
            <div>
              <h1 id="edit-title">내 정보 수정</h1>
              <p>닉네임을 변경할 수 있어요. 이메일과 프로필 이미지는 읽기 전용이에요.</p>
            </div>
            <button
              className="primary-button compact-button"
              type="submit"
              disabled={!isNicknameValid(nickname) || disabled}
            >
              {update.isPending ? "저장 중" : "변경사항 저장"}
            </button>
          </div>
          <div className="profile-grid">
            <div className="profile-avatar">
              <ProfileAvatar imageUrl="" />
              <strong>프로필 이미지</strong>
            </div>
            <div className="member-form">
              <FormField
                id="profile-nickname"
                label="닉네임"
                value={nickname}
                disabled={disabled}
                onChange={(event) => {
                  setNickname(event.target.value);
                  setMessage("");
                  duplicate.reset();
                }}
                error={!isNicknameValid(nickname) ? "닉네임은 2~12자로 입력해 주세요." : undefined}
                action={
                  <button
                    className="duplicate-button"
                    type="button"
                    disabled={!isNicknameValid(nickname) || disabled}
                    onClick={() => {
                      if (nickname.trim() === member.nickname)
                        setMessage("현재 사용 중인 닉네임이에요.");
                      else duplicate.mutate(nickname.trim());
                    }}
                  >
                    {duplicate.isPending ? "확인 중" : "중복 확인"}
                  </button>
                }
              />
              <FormField
                id="profile-email"
                label="이메일"
                type="email"
                value={member.email}
                readOnly
              />
              {message && (
                <p role="status" className="form-notice">
                  {message}
                </p>
              )}
              <Link className="text-sm text-blue-600" to="/profile">
                취소
              </Link>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
