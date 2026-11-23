import type { Metadata } from "next";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMCine",
  description: "TMDB 영화 목록, 검색, 상세 정보를 볼 수 있는 서비스",
  icons: { icon: "/icons/movie-icons/movie.svg" },
};

// index.html + main.tsx + routes/__root.tsx의 역할을 해요.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
