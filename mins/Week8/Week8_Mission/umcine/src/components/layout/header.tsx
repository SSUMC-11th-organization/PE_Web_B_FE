import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { memberQueries } from "../../api/members/me";
import { clearPrivateQueries } from "../../lib/query-client";
import { useAuthStore } from "../../stores/auth-store";

const navigationClass =
  "text-sm font-bold text-[#606774] no-underline aria-[current=page]:text-[#17191e] aria-[current=page]:underline aria-[current=page]:underline-offset-2";
export function Header() {
  const token = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery(memberQueries.me(token));
  const navigate = useNavigate();
  function logout() {
    useAuthStore.getState().setAccessToken(null);
    clearPrivateQueries();
    void navigate({ to: "/login" });
  }
  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-4 border-b border-[#e3e6eb] bg-white px-5 py-5 sm:px-10 lg:px-20 lg:py-6">
      <div className="flex min-w-0 flex-wrap items-center gap-5 lg:gap-[42px]">
        <Link
          className="flex items-center gap-[10px] text-xl font-black tracking-[-0.7px] text-[#17191e] no-underline"
          to="/"
          aria-label="UMCine 홈"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17191e]">
            <img className="block h-6 w-6" src="/icons/movie.svg" alt="" />
          </span>
          <span>UMCine</span>
        </Link>
        <nav className="flex items-center gap-5 sm:gap-[30px]" aria-label="주요 메뉴">
          <Link className={navigationClass} to="/" activeOptions={{ exact: true }}>
            영화
          </Link>
          <Link className={navigationClass} to="/search">
            검색
          </Link>
          <Link className={navigationClass} to="/profile">
            내 정보
          </Link>
        </nav>
      </div>
      <div className="flex flex-wrap items-center gap-[10px]">
        <Link
          className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#e3e6eb] bg-white"
          to="/search"
          aria-label="영화 검색"
        >
          <img className="block h-6 w-6" src="/icons/search.svg" alt="" />
        </Link>
        {!token ? (
          <Link className="primary-button compact-button" to="/login">
            로그인
          </Link>
        ) : (
          <>
            {meQuery.isLoading ? (
              <span
                className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"
                role="status"
                aria-label="내 정보 확인 중"
              />
            ) : (
              <Link className="primary-button compact-button" to="/profile">
                {meQuery.data ? `${meQuery.data.nickname}님` : "마이페이지"}
              </Link>
            )}
            <button className="text-xs text-[#606774] underline" type="button" onClick={logout}>
              로그아웃
            </button>
          </>
        )}
      </div>
    </header>
  );
}
