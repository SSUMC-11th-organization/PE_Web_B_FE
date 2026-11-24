import { Suspense } from "react";
import MovieSearch from "@/components/search/movie-search";
import LoadingState from "@/components/status/loading-state";

export default function SearchPage() {
  // useSearchParams 값은 요청 시점에 알 수 있어서 Suspense로 감싸야 빌드할 수 있어요.
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 flex-col">
          <LoadingState message="검색 화면을 불러오는 중이에요." />
        </main>
      }
    >
      <MovieSearch />
    </Suspense>
  );
}
