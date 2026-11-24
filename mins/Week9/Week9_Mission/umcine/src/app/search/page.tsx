import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "../../screens/movies/search-page";
export const metadata: Metadata = {
  title: "영화 검색",
  description: "제목으로 영화를 검색하세요.",
};
export default function Page() {
  return (
    <Suspense fallback={<main role="status">검색 화면을 준비하고 있어요.</main>}>
      <SearchPage />
    </Suspense>
  );
}
