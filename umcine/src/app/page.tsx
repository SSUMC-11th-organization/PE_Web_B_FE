import type { Metadata } from "next";
import { Suspense } from "react";
import { MovieGridSkeleton } from "../components/movies/movie-grid";
import { MovieListPage } from "../screens/movies/movie-list-page";

export const metadata: Metadata = {
  // title.template은 하위 세그먼트에만 적용돼서, 루트 page.tsx는 absolute로 전체 제목을 적어요.
  title: { absolute: "영화 목록 | UMCine" },
  description: "지금 인기 있는 영화 목록을 페이지별로 둘러봐요.",
};

// page.tsx는 Server Component로 두고, ?page= 를 읽고 클릭을 처리하는 화면만 Client Component로 분리했어요.
// useSearchParams는 요청을 받아야 알 수 있는 값이라 Suspense 경계 안에서 읽어요.
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-[1440px] px-4 pt-6 pb-16 md:px-20">
          <MovieGridSkeleton />
        </main>
      }
    >
      <MovieListPage />
    </Suspense>
  );
}
