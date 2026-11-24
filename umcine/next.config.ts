import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // create-next-app 기본 설정을 그대로 가져왔어요.
  cacheComponents: true,
  partialPrefetching: true,
  // Vite의 @tailwindcss/vite 플러그인 대신 Turbopack용 Tailwind 로더를 사용해요.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // next/image로 외부 이미지를 최적화하려면 가져올 서버를 허용 목록에 등록해야 해요.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" }],
  },
};

export default nextConfig;
