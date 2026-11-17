import { Link } from "@tanstack/react-router";
import { type SubmitEvent, useState } from "react";
import { FormField } from "../../components/auth/form-field";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { isEmailValid } from "../../utils/member-validation";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLoginMutation();
  const canSubmit = isEmailValid(form.email) && form.password.length > 0;
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;
    loginMutation.mutate({ email: form.email.trim(), password: form.password });
  }
  return (
    <main className="auth-main">
      <section className="auth-card" aria-labelledby="login-title">
        <h1 id="login-title">로그인</h1>
        <form
          className="member-form"
          onSubmit={handleSubmit}
          noValidate
          aria-busy={loginMutation.isPending}
        >
          <FormField
            id="login-email"
            label="이메일"
            icon="mail"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={form.email}
            disabled={loginMutation.isPending}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            error={
              form.email && !isEmailValid(form.email) ? "이메일 형식을 확인해 주세요." : undefined
            }
          />
          <FormField
            id="login-password"
            label="비밀번호"
            icon="lock"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호"
            value={form.password}
            disabled={loginMutation.isPending}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <button
            className="primary-button"
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>
        <p className="auth-link login-footer">
          처음이신가요? <Link to="/signup">회원가입</Link>
        </p>
      </section>
    </main>
  );
}
