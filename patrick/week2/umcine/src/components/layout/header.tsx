import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

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
        <img src="/icons/movie.svg" alt="" className="w-7 h-7" />
        UMCine
      </p>
      <nav className="flex gap-7 text-[15px]">
        <Link
          to="/"
          className="text-gray-500 no-underline hover:text-gray-900"
          activeProps={{ className: "text-gray-900 font-semibold" }}
          activeOptions={{ exact: true }}
        >
          홈
        </Link>
        <Link
          to="/search"
          className="text-gray-500 no-underline hover:text-gray-900"
          activeProps={{ className: "text-gray-900 font-semibold" }}
        >
          검색
        </Link>
        <Link
          to="/my-info"
          className="text-gray-500 no-underline hover:text-gray-900"
          activeProps={{ className: "text-gray-900 font-semibold" }}
        >
          내정보
        </Link>
      </nav>
      {!accessToken ? (
        <Link
          to="/login"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-blue-700"
        >
          로그인
        </Link>
      ) : meQuery.isLoading ? (
        <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
      ) : (
        <Link
          to="/my-info"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-blue-700"
        >
          마이페이지
        </Link>
      )}
    </header>
  );
}