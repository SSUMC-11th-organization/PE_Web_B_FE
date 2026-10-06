import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const navLinkClassName =
  "text-sm font-bold whitespace-nowrap transition-colors hover:text-ink";

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const isMoviesActive = pathname === "/" || pathname.startsWith("/movies");
  const isSearchActive = pathname === "/search";

  return (
    <header className="flex items-center justify-between gap-4 border-b border-line bg-surface px-4 py-6 sm:px-10 lg:px-20">
      <div className="flex items-center gap-5 sm:gap-[42px]">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border-2 border-ink">
            <img className="size-6" src="/icons/movie.svg" alt="" />
          </span>
          <span className="hidden text-xl font-black tracking-[-0.7px] text-ink sm:inline">
            UMCine
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-[30px]">
          <Link
            to="/"
            className={cn(
              navLinkClassName,
              isMoviesActive ? "text-ink underline" : "text-ink-secondary",
            )}
          >
            영화
          </Link>
          <Link
            to="/search"
            className={cn(
              navLinkClassName,
              isSearchActive ? "text-ink underline" : "text-ink-secondary",
            )}
          >
            검색
          </Link>
          <a href="/profile" className={cn(navLinkClassName, "text-ink-secondary")}>
            내 정보
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          to="/search"
          className="flex size-[42px] items-center justify-center rounded-lg border border-line bg-surface"
          aria-label="영화 검색"
        >
          <img className="size-6" src="/icons/search.svg" alt="" />
        </Link>
        <button
          type="button"
          className="h-[42px] cursor-pointer rounded-lg bg-action px-4 text-sm font-extrabold whitespace-nowrap text-white transition-colors hover:bg-action-hover"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
