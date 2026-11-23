"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useLoginMutation } from "@/hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;

const INPUT_CLASS =
  "h-12 rounded-lg border border-line bg-surface px-4 text-sm outline-none placeholder:text-ink-3 focus:border-ink-3";

export function LoginForm() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const loginMutation = useLoginMutation();

  // 이메일 형식이 맞고 비밀번호를 입력하면 제출 가능
  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleChangeField = (key: DefaultFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-[430px] max-w-full flex-col"
    >
      <h1 className="mb-5 text-[32px] font-bold tracking-[-1.2px]">로그인</h1>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="login-email" className="text-[13px] font-bold">
            이메일
          </label>
          <input
            id="login-email"
            type="email"
            value={form.email}
            onChange={(e) => handleChangeField("email", e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            className={INPUT_CLASS}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="login-password" className="text-[13px] font-bold">
            비밀번호
          </label>
          <input
            id="login-password"
            type="password"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
            placeholder="비밀번호"
            autoComplete="current-password"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit || loginMutation.isPending}
        className="mt-4 h-[46px] rounded-lg bg-primary text-sm font-extrabold text-white disabled:cursor-default disabled:opacity-40"
      >
        {loginMutation.isPending ? "로그인 중" : "로그인"}
      </button>

      <p className="mt-6 text-center text-xs text-ink-2">
        아직 계정이 없나요?{" "}
        <Link
          href="/signup"
          className="font-bold text-primary underline underline-offset-2"
        >
          회원가입
        </Link>
      </p>
    </form>
  );
}
