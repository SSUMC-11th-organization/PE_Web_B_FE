"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/hooks/use-login-mutation";
import { useAuthStore } from "@/stores/auth-store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginFormKey = "email" | "password";

export function LoginPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLoginMutation();

  // 이미 로그인한 사람이 /login으로 오면 홈으로 보내요.
  // 토큰은 브라우저에만 있어서 서버가 아니라 화면이 뜬 뒤에 확인해요.
  useEffect(() => {
    if (accessToken) {
      router.replace("/");
    }
  }, [accessToken, router]);

  const canSubmit =
    EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleChange = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <div className="flex justify-center px-4 py-16">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="mb-6 text-2xl font-bold text-gray-900">로그인</h1>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            이메일
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 focus-within:border-blue-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            비밀번호
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 focus-within:border-blue-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <input
              id="password"
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
          className="w-full cursor-pointer rounded-lg border-0 bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          처음이신가요?{" "}
          <Link href="/signup" className="font-semibold text-blue-600 no-underline">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
}