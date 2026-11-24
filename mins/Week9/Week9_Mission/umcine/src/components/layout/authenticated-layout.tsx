"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { memberQueries } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
export function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hasHydrated);
  const me = useQuery(memberQueries.me(token));
  const router = useRouter();
  useEffect(() => {
    if (hydrated && !token) router.replace("/login");
  }, [hydrated, token, router]);
  if (!hydrated || !token || me.isLoading)
    return (
      <main className="profile-main" role="status">
        내 정보를 확인하는 중이에요.
      </main>
    );
  if (me.isError || !me.data)
    return (
      <main className="profile-main" role="alert">
        <p>내 정보를 불러오지 못했어요.</p>
        <button type="button" onClick={() => void me.refetch()}>
          다시 시도
        </button>
      </main>
    );
  return <div data-layout="authenticated">{children}</div>;
}
