import { clearPrivateQueries } from "../lib/query-client";
import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = useAuthStore.getState().accessToken;
        if (token) request.headers.set("Authorization", `Bearer ${token}`);
      },
    ],
    afterResponse: [
      ({ request, response }) => {
        const token = useAuthStore.getState().accessToken;
        if (
          response.status === 401 &&
          token &&
          request.headers.get("Authorization") === `Bearer ${token}`
        ) {
          useAuthStore.getState().setAccessToken(null);
          clearPrivateQueries();
        }
      },
    ],
  },
});
