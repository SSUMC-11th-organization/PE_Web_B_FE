"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

const NAV_ITEMS = [
  { href: "/", label: "홈", exact: true },
  { href: "/search", label: "검색", exact: false },
  { href: "/my-info", label: "내정보", exact: false },
];

const NAV_LINK_BASE = "no-underline";
const NAV_LINK_ACTIVE = "text-gray-900 font-semibold";
const NAV_LINK_DEFAULT = "text-gray-500 hover:text-gray-900";

// 현재 주소를 읽어서 지금 메뉴를 진하게 보여줘요.
// 주소는 요청이 와야 알 수 있어서, 이 부분만 따로 떼어 Suspense로 감싸요.
function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${NAV_LINK_BASE} ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_DEFAULT}`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

// 주소를 아직 모를 때(준비되는 동안)는 강조 없이 메뉴만 보여줘요
function NavLinksFallback() {
  return (
    <>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${NAV_LINK_BASE} ${NAV_LINK_DEFAULT}`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="flex items-center justify-between gap-6 px-12 py-5">
      <p className="flex items-center gap-2 m-0 text-xl font-extrabold tracking-[-0.04em]">
        <Image
          src="/icons/movie.svg"
          alt=""
          width={28}
          height={28}
          className="w-7 h-7"
        />
        UMCine
      </p>
      <nav className="flex gap-7 text-[15px]">
        <Suspense fallback={<NavLinksFallback />}>
          <NavLinks />
        </Suspense>
      </nav>
      {!accessToken ? (
        <Link
          href="/login"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-blue-700"
        >
          로그인
        </Link>
      ) : meQuery.isLoading ? (
        <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
      ) : (
        <Link
          href="/my-info"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-blue-700"
        >
          마이페이지
        </Link>
      )}
    </header>
  );
}
