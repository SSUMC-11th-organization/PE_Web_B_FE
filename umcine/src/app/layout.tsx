import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";
import { Providers } from "../components/providers/providers";
import "../index.css";

// 여러 페이지에서 함께 쓰는 정보는 layout.tsx에 두고, 페이지마다 다른 제목은 각 page.tsx에서 정해요.
export const metadata: Metadata = {
  title: { default: "UMCine", template: "%s | UMCine" },
  description: "TMDB 영화 정보를 둘러보고 즐겨찾기와 평점을 남기는 UMCine예요.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "UMCine",
    description: "지금 인기 있는 영화를 둘러보고 평점을 남겨 보세요.",
    siteName: "UMCine",
    type: "website",
  },
};

// TanStack Router의 __root.tsx(createRootRoute + <Outlet />)가 layout.tsx({children})로 바뀌었어요.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex min-h-dvh flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
