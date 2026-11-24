import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  distDir: process.env.UMC_FIXTURE === "1" ? ".next-fixture" : ".next",
  turbopack: { root: path.resolve(process.cwd()) },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" }],
  },
};
export default nextConfig;
