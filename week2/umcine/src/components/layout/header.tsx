import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const navLinkClassName =
  "text-[15px] whitespace-nowrap transition-colors hover:text-[#1a1a1a]";

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const isMoviesActive = pathname === "/" || pathname.startsWith("/movies");
  const isSearchActive = pathname === "/search";

  return (
    <header className="flex items-center justify-between gap-4 border-b border-[#ebebeb] px-4 py-3.5 sm:px-10">
      <div className="flex items-center gap-5 sm:gap-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-[#1a1a1a]"
        >
          <span className="flex size-7 items-center justify-center rounded-[7px] bg-[#1a1a1a]">
            <img className="size-[18px] invert" src="/icons/movie.svg" alt="" />
          </span>
          <span className="hidden sm:inline">UMCine</span>
        </Link>

        <nav className="flex gap-4 sm:gap-6">
          <Link
            to="/"
            className={cn(
              navLinkClassName,
              isMoviesActive ? "font-semibold text-[#1a1a1a]" : "text-[#4b4b4b]",
            )}
          >
            영화
          </Link>
          <Link
            to="/search"
            className={cn(
              navLinkClassName,
              isSearchActive ? "font-semibold text-[#1a1a1a]" : "text-[#4b4b4b]",
            )}
          >
            검색
          </Link>
          <a href="/profile" className={cn(navLinkClassName, "text-[#4b4b4b]")}>
            내 정보
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          to="/search"
          className="flex size-8 items-center justify-center"
          aria-label="검색"
        >
          <img className="size-[22px]" src="/icons/search.svg" alt="" />
        </Link>
        <button
          type="button"
          className="cursor-pointer rounded-lg bg-[#2563eb] px-[18px] py-2 text-[15px] whitespace-nowrap text-white transition-colors hover:bg-[#1d4ed8]"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
