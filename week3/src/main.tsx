import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { fetchPopularMoviesWithFetch } from "./apis/fetch-popular-movies";
import "./index.css";

// 순수 fetch 요청을 개발 환경에서 한 번 보내 Network 패널에서 확인해요.
if (import.meta.env.DEV) {
  fetchPopularMoviesWithFetch()
    .then((data) => console.info("[fetch] 인기 영화", data))
    .catch((error: unknown) => console.warn("[fetch] 인기 영화 요청 실패", error));
}

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
