import { useQuery } from "@tanstack/react-query";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { memberQueries } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
export function AuthenticatedLayout() {
  const token = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery(memberQueries.me(token));
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) void navigate({ to: "/login", replace: true });
  }, [token, navigate]);
  if (!token) return null;
  if (meQuery.isLoading)
    return (
      <main className="profile-main" role="status">
        내 정보를 확인하는 중이에요.
      </main>
    );
  if (meQuery.isError || !meQuery.data)
    return (
      <main className="profile-main" role="alert">
        <p>내 정보를 불러오지 못했어요.</p>
        <button type="button" onClick={() => void meQuery.refetch()}>
          다시 시도
        </button>
      </main>
    );
  return (
    <div data-layout="authenticated">
      <Outlet />
    </div>
  );
}
