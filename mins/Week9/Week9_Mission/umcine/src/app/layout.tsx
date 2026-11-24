import type { Metadata } from "next";
import localFont from "next/font/local";
import { type ReactNode, Suspense } from "react";
import { Header } from "../components/layout/header";
import { Providers } from "./providers";
import "../index.css";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "100 900",
});
export const metadata: Metadata = {
  title: { default: "UMCine | 영화", template: "%s | UMCine" },
  description: "영화를 검색하고 즐겨찾기와 나만의 평점을 기록하세요.",
  openGraph: {
    title: "UMCine",
    description: "영화를 찾고 나만의 감상을 기록하는 공간",
    type: "website",
    locale: "ko_KR",
  },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <Providers>
          <Suspense
            fallback={
              <header className="flex h-[91px] items-center border-b border-[#e3e6eb] bg-white px-5 sm:px-10 lg:px-20">
                <span className="text-xl font-black">UMCine</span>
              </header>
            }
          >
            <Header />
          </Suspense>
          {children}
        </Providers>
      </body>
    </html>
  );
}
