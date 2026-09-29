import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const isMovies = pathname === "/" || pathname.startsWith("/movies");
  const isSearch = pathname.startsWith("/search");

  const navClass = (active: boolean) =>
    cn("text-sm font-bold text-ink-2", active && "text-ink underline underline-offset-4");

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
          <span className={navClass(false)}>내 정보</span>
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
        <button
          type="button"
          className="h-[42px] rounded-lg bg-primary px-4 text-sm font-extrabold text-white hover:bg-blue-700"
        >
          로그인
        </button>
      </div>
    </header>
  );
}

export default Header;
