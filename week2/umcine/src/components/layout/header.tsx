import { Link, useLocation } from "@tanstack/react-router";
import { useMeQuery } from "../../hooks/use-me-query";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

const navLinkClassName =
  "text-sm font-bold whitespace-nowrap transition-colors hover:text-ink";

const actionLinkClassName =
  "flex h-[42px] items-center rounded-lg bg-action px-4 text-sm font-extrabold whitespace-nowrap text-white transition-colors hover:bg-action-hover";

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const accessToken = useAuthStore((state) => state.accessToken);
  // 토큰이 있을 때만 내 정보를 조회해요. 토큰이 만료돼 401이면 authApi가 토큰을 지워요.
  const meQuery = useMeQuery();
  const isMoviesActive = pathname === "/" || pathname.startsWith("/movies");
  const isSearchActive = pathname === "/search";
  const isProfileActive = pathname.startsWith("/profile");

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
          <Link
            to="/profile"
            className={cn(
              navLinkClassName,
              isProfileActive ? "text-ink underline" : "text-ink-secondary",
            )}
          >
            내 정보
          </Link>
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
        {!accessToken ? (
          <Link to="/login" className={actionLinkClassName}>
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="h-[42px] w-24 animate-pulse rounded-lg bg-line" aria-label="내 정보를 불러오는 중" />
        ) : (
          <Link to="/profile" className={actionLinkClassName}>
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}
