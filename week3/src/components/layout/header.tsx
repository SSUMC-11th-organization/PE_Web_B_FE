import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { useMeQuery } from "../../hooks/use-me-query";
import { useAuthStore } from "../../stores/auth-store";

function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const isMovies = pathname === "/" || pathname.startsWith("/movies");
  const isSearch = pathname.startsWith("/search");
  const isMy = pathname.startsWith("/my");

  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();

  const navClass = (active: boolean) =>
    cn(
      "text-sm font-bold text-ink-2",
      active && "text-ink underline underline-offset-4",
    );

  return (
    <header className="flex items-center justify-between border-b border-line bg-surface px-20 py-6">
      <div className="flex items-center gap-[42px]">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border-2 border-ink">
            <img src="/icons/movie-icons/movie.svg" alt="" className="size-6" />
          </span>
          <span className="text-xl font-black tracking-[-0.7px]">UMCine</span>
        </Link>

        <nav className="flex items-center gap-[30px]">
          <Link to="/" className={navClass(isMovies)}>
            영화
          </Link>
          <Link to="/search" className={navClass(isSearch)}>
            검색
          </Link>
          <Link to="/my" className={navClass(isMy)}>
            내 정보
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="검색"
          onClick={() => navigate({ to: "/search" })}
          className="flex size-[42px] items-center justify-center rounded-lg border border-line bg-surface hover:bg-page"
        >
          <img src="/icons/movie-icons/search.svg" alt="" className="size-6" />
        </button>
        {!accessToken ? (
          <Link
            to="/login"
            className="flex h-[42px] items-center rounded-lg bg-primary px-4 text-sm font-extrabold text-white hover:bg-blue-700"
          >
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="h-[42px] w-24 animate-pulse rounded-lg bg-line" />
        ) : (
          <Link
            to="/my"
            className="flex h-[42px] items-center rounded-lg bg-primary px-4 text-sm font-extrabold text-white hover:bg-blue-700"
          >
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
