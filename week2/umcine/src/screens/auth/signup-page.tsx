"use client";

import Link from "next/link";
import { useState } from "react";
import { useSignupMutation } from "@/hooks/use-signup-mutation";
import { EMAIL_REGEX, isNicknameValid } from "@/utils/members/validation";

// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
    email: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
};

type FormKey = keyof typeof DEFAULT_FORM;

const inputClassName =
    "mt-2 h-12 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-ink outline-none placeholder:text-ink-tertiary focus:border-ink";

export function SignupPage() {
    const [form, setForm] = useState(DEFAULT_FORM);
    const signupMutation = useSignupMutation();

    const isEmailValid = EMAIL_REGEX.test(form.email.trim());
    const isNicknameOk = isNicknameValid(form.nickname);
    const isPasswordValid = PASSWORD_REGEX.test(form.password);
    const isPasswordConfirmValid =
        form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
    const canSubmit = isEmailValid && isNicknameOk && isPasswordValid && isPasswordConfirmValid;

    // 입력을 시작한 필드에만 오류를 보여줘요
    const errors: Record<FormKey, string | null> = {
        email: form.email && !isEmailValid ? "이메일 형식으로 입력해 주세요." : null,
        nickname: form.nickname && !isNicknameOk ? "닉네임은 2~12자로 입력해 주세요." : null,
        password:
            form.password && !isPasswordValid
                ? "대문자, 소문자, 숫자, 특수문자(!@#$%^&*)를 포함해 8자 이상 입력해 주세요."
                : null,
        passwordConfirm:
            form.passwordConfirm && !isPasswordConfirmValid ? "비밀번호가 일치하지 않아요." : null,
    };

    const handleChangeField = (key: FormKey, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!canSubmit || signupMutation.isPending) return;

        signupMutation.mutate({
            email: form.email.trim(),
            nickname: form.nickname.trim(),
            password: form.password,
        });
    };

    const fields: { key: FormKey; label: string; type: string; placeholder: string; autoComplete: string }[] = [
        { key: "email", label: "이메일", type: "email", placeholder: "name@example.com", autoComplete: "email" },
        { key: "nickname", label: "닉네임", type: "text", placeholder: "2~12자", autoComplete: "nickname" },
        { key: "password", label: "비밀번호", type: "password", placeholder: "비밀번호", autoComplete: "new-password" },
        {
            key: "passwordConfirm",
            label: "비밀번호 확인",
            type: "password",
            placeholder: "비밀번호 확인",
            autoComplete: "new-password",
        },
    ];

    // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 꺼요
    return (
        <main className="flex flex-1 items-center justify-center px-4 py-20">
            <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-[430px] flex-col">
                <h1 className="text-[32px] leading-10 font-bold tracking-[-1.2px] text-ink">회원가입</h1>

                {fields.map((field) => (
                    <div key={field.key} className="mt-6">
                        <label htmlFor={`signup-${field.key}`} className="text-sm font-bold text-ink">
                            {field.label}
                        </label>
                        <input
                            id={`signup-${field.key}`}
                            type={field.type}
                            autoComplete={field.autoComplete}
                            placeholder={field.placeholder}
                            value={form[field.key]}
                            onChange={(event) => handleChangeField(field.key, event.target.value)}
                            className={inputClassName}
                        />
                        {errors[field.key] && <p className="mt-1.5 text-xs text-danger">{errors[field.key]}</p>}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={!canSubmit || signupMutation.isPending}
                    className="mt-7 h-12 cursor-pointer rounded-lg bg-action text-sm font-extrabold text-white transition-colors hover:bg-action-hover active:bg-action-pressed disabled:cursor-not-allowed disabled:bg-action-disabled"
                >
                    {signupMutation.isPending ? "가입 중" : "가입하기"}
                </button>

                <p className="mt-6 text-center text-[13px] text-ink-tertiary">
                    이미 계정이 있나요?{" "}
                    <Link href="/login" className="font-bold text-action hover:underline">
                        로그인
                    </Link>
                </p>
            </form>
        </main>
    );
}
