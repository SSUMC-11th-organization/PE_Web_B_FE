import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "@/screens/movies/search-page";

export const metadata: Metadata = { title: "영화 검색 | UMCine" };

export default function Page() {
    // SearchPage가 useSearchParams로 요청마다 달라지는 query를 읽어서 Suspense 경계 안에 둬요
    return (
        <Suspense
            fallback={
                <main className="flex flex-1 items-center justify-center py-20 text-sm text-ink-tertiary">
                    검색 화면을 준비하는 중이에요.
                </main>
            }
        >
            <SearchPage />
        </Suspense>
    );
}
