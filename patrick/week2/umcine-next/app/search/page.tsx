import { Suspense } from "react";
import { SearchPage } from "@/screens/movies/search-page";

export default function SearchRoute() {
  // 주소의 ?query= 값을 읽는 부분은 요청이 와야 알 수 있어서 Suspense로 감싸요
  return (
    <Suspense fallback={<main>검색 화면을 불러오는 중이에요.</main>}>
      <SearchPage />
    </Suspense>
  );
}
