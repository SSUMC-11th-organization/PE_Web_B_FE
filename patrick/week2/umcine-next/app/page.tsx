import { Suspense } from "react";
import { MovieListPage } from "@/screens/movies/movie-list-page";

export default function HomePage() {
  // 주소의 ?page= 값을 읽는 부분은 요청이 와야 알 수 있어서 Suspense로 감싸요
  return (
    <Suspense
      fallback={<p className="px-8 py-6 text-gray-500">영화 목록을 불러오는 중이에요.</p>}
    >
      <MovieListPage />
    </Suspense>
  );
}
