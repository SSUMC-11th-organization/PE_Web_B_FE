import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "./providers";
import "@/index.css";

export const metadata: Metadata = {
    title: "UMCine",
    description: "TMDB 인기 영화를 둘러보고 검색하고 즐겨찾기할 수 있어요.",
    icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ko">
            <head>
                {/* eslint-disable-next-line @next/next/no-css-tags */}
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
                />
            </head>
            <body>
                <Providers>
                    <div className="flex min-h-svh flex-col bg-page text-ink">
                        <Header />
                        {children}
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
