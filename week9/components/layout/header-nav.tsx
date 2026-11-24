"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

// /movies/[movieId]의 경로는 요청 시점에 정해지므로, 그 전에는 강조 없는 메뉴를 보여줘요.
function HeaderNav() {
  return (
    <Suspense fallback={<NavLinks pathname={null} />}>
      <ActiveNavLinks />
    </Suspense>
  );
}

function ActiveNavLinks() {
  return <NavLinks pathname={usePathname()} />;
}

function NavLinks({ pathname }: { pathname: string | null }) {
  const isMovies = pathname === "/" || pathname?.startsWith("/movies");
  const isSearch = pathname?.startsWith("/search");
  const isMy = pathname?.startsWith("/my");

  const navClass = (active: boolean | undefined) =>
    cn("text-sm font-bold text-ink-2", active && "text-ink underline underline-offset-4");

  return (
    <nav className="flex items-center gap-[30px]">
      <Link href="/" className={navClass(isMovies)}>
        영화
      </Link>
      <Link href="/search" className={navClass(isSearch)}>
        검색
      </Link>
      <Link href="/my" className={navClass(isMy)}>
        내 정보
      </Link>
    </nav>
  );
}

export default HeaderNav;
