import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // public/icons의 SVG 아이콘은 크기 변환 · 포맷 변환 이득이 없어 <img>를 그대로 써요.
    // TMDB 포스터 · 배경처럼 큰 사진은 next/image(MoviePoster, 상세 배경)로 최적화해요.
    rules: { "@next/next/no-img-element": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
