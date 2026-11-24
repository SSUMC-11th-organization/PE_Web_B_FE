# 9주차 미션 기록 (초안) — UMCine TanStack Router → Next.js 마이그레이션

## 1. 프로젝트 설정 옮기기

| Vite + TanStack Router | Next.js 16 (App Router) |
| --- | --- |
| `vite.config.ts` (`tanstackRouter`, `react`, `@tailwindcss/vite`) | `next.config.ts` (`cacheComponents`, `@tailwindcss/turbopack`, `images.remotePatterns`) |
| `index.html` + `src/main.tsx` (`createRoot`, `RouterProvider`) | `src/app/layout.tsx` (`<html>`, `<body>`) |
| `tsconfig.app.json` / `tsconfig.node.json` | `tsconfig.json` (`next` 플러그인) |
| `eslint.config.js` (react-refresh) | `eslint.config.mjs` (`eslint-config-next`) |
| `VITE_*` + `import.meta.env` | `NEXT_PUBLIC_*` + `process.env` |
| `pnpm dev` = vite | `pnpm dev` = next dev |

- 삭제: `@tanstack/react-router`, `@tanstack/router-plugin`, `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `routeTree.gen.ts`, `src/routes/`
- 추가: `next`, `@tailwindcss/turbopack`, `eslint-config-next`

## 2. 라우트 구조

```
src/app/
├── layout.tsx                 ← __root.tsx (Header + children + Footer, 공통 metadata)
├── not-found.tsx              ← notFoundComponent
├── page.tsx                   ← routes/index.tsx            (/)
├── search/page.tsx            ← routes/search.tsx           (/search?query=&page=)
├── movies/[movieId]/page.tsx  ← routes/movies.$movieId.tsx  (/movies/:movieId, generateMetadata)
├── login/page.tsx             ← routes/login.tsx            (beforeLoad → AuthGuard guest)
├── signup/page.tsx            ← routes/signup.tsx
└── (protected)/
    ├── layout.tsx             ← (protected)/route.tsx       (beforeLoad → AuthGuard member)
    └── my/
        ├── page.tsx           ← /my
        └── edit/page.tsx      ← /my/edit
```

## 3. TanStack Router API → Next.js API

| TanStack Router | Next.js | 사용한 곳 |
| --- | --- | --- |
| `<Link to="/x">` | `<Link href="/x">` (`next/link`) | 전체 |
| `<Link to="/movies/$movieId" params={{ movieId }}>` | ``<Link href={`/movies/${id}`}>`` | movie-card, search-page, my-page |
| `activeProps` / `inactiveProps` | `usePathname()`으로 직접 비교 | header |
| `useNavigate()` → `navigate({ to })` | `useRouter()` → `router.push()` (`next/navigation`) | hooks, bookmark-button, my-edit-page |
| `useSearch({ from })` + `validateSearch` | `useSearchParams()` + `parsePage()` | movie-list-page, search-page |
| `navigate({ search: (prev) => ... })` | `new URLSearchParams(searchParams)` → `router.push` | search-page |
| `useParams({ from })` | 서버 `page.tsx`에서 `await params` → props | movie-detail-page |
| `beforeLoad` + `redirect` | Client `AuthGuard` (`router.replace`) | login, (protected) |
| `<Outlet />` | `{children}` | layout.tsx |

```tsx
// src/app/movies/[movieId]/page.tsx (Server Component)
export async function generateMetadata({ params }: MovieDetailRouteProps): Promise<Metadata> {
  const { movieId } = await params;
  const movie = await getMovieDetail(Number(movieId));
  return { title: movie.title, description: movie.overview, openGraph: { images: [posterUrl] } };
}

export default function MovieDetailRoute({ params }: MovieDetailRouteProps) {
  return (
    <Suspense fallback={<StatusMessage message="영화 정보를 불러오는 중이에요." />}>
      <MovieDetailScreen params={params} />
    </Suspense>
  );
}
```

## 4. Server / Client 경계

- **Server Component**: `app/**/page.tsx`, `app/**/layout.tsx`, `footer.tsx` — metadata export, params 읽기, Suspense 경계만 담당
- **Client Component (`"use client"`)**: `screens/*`(상태 · 쿼리 · 폼), `header.tsx`, `bookmark-button.tsx`, `my-rating-section.tsx`, `providers.tsx`, `auth-guard.tsx`
- `QueryClientProvider`는 Context라 `components/providers/providers.tsx`(Client)로 분리하고, `useState(() => new QueryClient())`로 하나만 만들었어요.

### 브라우저 API가 서버에서 실행되지 않게

```ts
// src/stores/auth-store.ts
persist(..., {
  storage: createJSONStorage(() => localStorage),
  skipHydration: true, // 서버 HTML(토큰 없음)과 첫 클라이언트 렌더를 맞추기 위해 자동 복원을 꺼요
  onRehydrateStorage: () => () => useAuthStore.setState({ hasHydrated: true }),
});

// src/components/providers/providers.tsx
useEffect(() => {
  useAuthStore.persist.rehydrate(); // hydration이 끝난 뒤 브라우저에서만 localStorage를 읽어요
}, []);
```

- `alert`, `window.scrollTo`는 이벤트 핸들러 · mutation 콜백 안에서만 실행돼 서버에서 호출되지 않아요.
- `AuthGuard`는 `hasHydrated` 전에는 판단하지 않아, 로그인한 사용자가 새로고침할 때 `/login`으로 튕기지 않아요.

## 5. 이미지 · 메타데이터

- `MoviePoster`: `<img>` → `next/image` (`fill` + `sizes`), 상세 배경은 `sizes="100vw"` + `priority`
- `next.config.ts`에 `image.tmdb.org` 허용
- 공통 `metadata`(title template `%s | UMCine`, OG)는 `layout.tsx`, 페이지별 제목은 각 `page.tsx`, 영화 상세는 `generateMetadata`

## 6. 최종 확인 결과

```
$ pnpm build
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /login
├   /movies/[movieId]
│ └ ◐ /movies/[movieId]
├ ○ /my
├ ○ /my/edit
├ ○ /search
└ ○ /signup
```

- `pnpm lint` 오류 · 경고 0개
- `/` 영화 목록, `/movies/1726` 상세(탭 제목 `아이언맨 | UMCine`), `/search?query=어벤져스` 검색, `/my` → 비로그인 시 `/login` 이동 확인

---

## ⚡ 트러블 슈팅

### 이슈 1 — 빌드 중 `usePathname()` 오류

**이슈**
```
Error: Route "/movies/[movieId]": Next.js encountered URL data `usePathname()` in a Client Component outside of `<Suspense>`.
This blocks prerendering because the value is only available at runtime.
```
**원인** Cache Components가 켜져 있으면 헤더처럼 모든 페이지에 들어가는 컴포넌트도 미리 렌더링돼요. 동적 경로에서는 현재 경로가 요청 시점에만 정해지는데, 헤더의 활성 메뉴 계산(`usePathname`)이 Suspense 밖에 있었어요.
**해결** 메뉴만 `NavMenu`로 분리하고 `<Suspense fallback={<NavMenuLinks pathname={null} />}>`로 감쌌어요. 헤더 나머지는 정적으로 미리 만들어져요.
**배운 점** 요청 시점 값(`params`, `searchParams`, `usePathname`, `useSearchParams`)을 읽는 곳은 가장 작은 단위로 Suspense를 둬요.

### 이슈 2 — `/my`에서 instant navigation 검증 오류 (dev)

**이슈**
```
Error: Route "/my": Could not validate that a segment in your UI has instant navigation.
This segment was dropped from rendering.
Dropped segment: src/app/(protected)/my/page.tsx
```
**원인** 토큰이 브라우저 localStorage에만 있어서 `AuthGuard`가 확인 전에는 children을 그리지 않아요. Next.js가 페이지 세그먼트를 검증할 수 없었어요.
**해결** `my/page.tsx`, `my/edit/page.tsx`에 `export const instant = false;`를 선언해 막히는 이동임을 명시했어요.
**배운 점** 클라이언트에서만 알 수 있는 인증 상태로 화면을 막으면 서버 렌더링 이점이 줄어요. 쿠키 기반 인증이면 서버에서 리다이렉트할 수 있어요.

### 이슈 3 — `src/pages` 폴더 이름 충돌

**원인** Next.js는 `src/pages`를 Pages Router 폴더로 인식해요. 기존 화면 컴포넌트 폴더 이름이 `pages`였어요.
**해결** `src/pages` → `src/screens`로 이름을 바꿨어요.

### 이슈 4 — 루트 페이지 탭 제목에 template이 적용되지 않음

**원인** `title.template`은 정의한 세그먼트의 **하위** 세그먼트에만 적용돼요. `app/page.tsx`는 루트 layout과 같은 세그먼트예요.
**해결** `title: { absolute: "영화 목록 | UMCine" }`로 지정했어요.

**참고 레퍼런스**
- Next.js — Migrating from Vite: https://nextjs.org/docs/app/guides/migrating/from-vite
- Next.js — Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
