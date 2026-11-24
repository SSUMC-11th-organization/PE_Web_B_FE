import { queryOptions } from "@tanstack/react-query";
import { authApi } from "../auth-api";
import { type ApiResponse, unwrap } from "../response";
export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}
export async function getMe(signal?: AbortSignal) {
  return unwrap(await authApi.get("members/me", { signal }).json<ApiResponse<MemberInfo>>());
}
export const memberQueries = {
  me: (token: string | null) =>
    queryOptions({
      queryKey: ["members", "me"],
      queryFn: ({ signal }) => getMe(signal),
      enabled: Boolean(token),
      staleTime: 5 * 60_000,
      retry: false,
    }),
};
