"use client";

import Link from "next/link";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useMeQuery } from "@/hooks/use-me-query";
import { useAuthStore } from "@/stores/auth-store";

const LINK_CLASS =
  "flex h-[42px] items-center rounded-lg bg-primary px-4 text-sm font-extrabold text-white hover:bg-blue-700";

function HeaderAuthButton() {
  const isHydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();

  // 토큰을 읽기 전에는 로그인 여부를 모르므로 자리만 잡아둬요.
  if (!isHydrated || meQuery.isLoading) {
    return <span className="h-[42px] w-24 animate-pulse rounded-lg bg-line" />;
  }

  if (!accessToken) {
    return (
      <Link href="/login" className={LINK_CLASS}>
        로그인
      </Link>
    );
  }

  return (
    <Link href="/my" className={LINK_CLASS}>
      마이페이지
    </Link>
  );
}

export default HeaderAuthButton;
