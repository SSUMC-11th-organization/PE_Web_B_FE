import type { Metadata } from "next";
import { Suspense } from "react";
import StatusMessage from "../../components/common/status-message";
import { SearchPage } from "../../screens/movies/search-page";

export const metadata: Metadata = {
  title: "영화 검색",
  description: "영화 제목이나 원제로 영화를 검색해요.",
};

export default function SearchRoute() {
  return (
    <Suspense fallback={<StatusMessage className="mt-10" message="검색 화면을 준비하는 중이에요." />}>
      <SearchPage />
    </Suspense>
  );
}
