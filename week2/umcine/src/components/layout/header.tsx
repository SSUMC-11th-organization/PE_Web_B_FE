import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <a className="logo" href="/">
          <span className="logo-mark">
            <img src="/icons/movie.svg" alt="" />
          </span>
          <span className="logo-text">UMCine</span>
        </a>

        <nav className="nav">
          <Link to="/">영화</Link>
          <Link to="/search">검색</Link>
          <a href="/profile">내 정보</a>
        </nav>
      </div>

      <div className="header-right">
        <button type="button" className="icon-button" aria-label="검색">
          <img src="/icons/search.svg" alt="" />
        </button>
        <button type="button" className={cn("login-button")}>
          로그인
        </button>
      </div>
    </header>
  );
}
