# 9주차 워크북 정리 — Next.js (App Router)

## 실습 파일 (`nextjs-example/`)

| 단원 | 파일 | 확인 방법 |
| --- | --- | --- |
| 2.1 프로젝트 생성 | `pnpm create next-app@latest nextjs-example --yes` | `pnpm dev` → 초기 화면 |
| 2.3 경로 추가 | `app/new/page.tsx` | `/new` |
| 2.4 동적 경로 | `app/[id]/page.tsx` (Suspense 방식) | `/1`, `/2` |
| 2.5 공통 레이아웃 | `app/layout.tsx` (Global Header / Footer) | `/new`, `/1` |
| 3.2 Client Component 분리 | `app/components/alert-button.tsx`, `app/page.tsx` | `/` → Click Me |
| 4.1 서버에서 API 요청 | `app/[id]/page.tsx` (jsonplaceholder todo) | `/1`, `/2` |
| 4.2 빌드 결과 | `pnpm build` | `○ /new`, `◐ /[id]` |
| 5.1~5.2 next/image | `next.config.ts`(images.remotePatterns), `app/media/page.tsx` | `/media` → Network |
| 5.3 next/font | `app/media/page.tsx` (Geist) | Elements → font-family |
| 5.4 메타데이터 | `app/new/page.tsx` (`metadata`, `openGraph`) | 탭 제목, `<head>` |

### 4.2 빌드 결과 (실제 출력)

```
Route (app)
┌ ○ /
├ ○ /_not-found
├   /[id]
│ └ ◐ /[id]
├ ○ /media
└ ○ /new

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

## 🎯 핵심 키워드

### 1. 프레임워크의 역할

**Q. Next.js는 TanStack Router에 더해 어떤 기능을 제공하나요?**

TanStack Router는 "URL ↔ 화면 연결"을 담당하는 **라이브러리**예요. 번들링(Vite), 데이터 캐시(TanStack Query), 이미지 · SEO 처리는 각각 따로 골라 붙여야 했어요.
Next.js는 라우팅을 포함해 웹 서비스에 필요한 기능을 한 번에 제공하는 **프레임워크**예요.

| 기능 | TanStack Router + Vite (8주차 UMCine) | Next.js (9주차 UMCine) |
| --- | --- | --- |
| 라우팅 · 레이아웃 | `routes/__root.tsx`, `route.tsx` | `app/layout.tsx`, `page.tsx` |
| 렌더링 위치 | 브라우저에서만 (CSR) — 빈 `<div id="root">`에 JS로 그림 | 서버에서 HTML을 먼저 만들고 브라우저에서 hydration |
| 렌더링 시점 | 항상 요청 후 브라우저에서 | 빌드 시(SSG) · 요청 시(SSR) · 섞어서(PPR) 선택 |
| 서버 코드 | 별도 백엔드 필요 | Server Component, Route Handler, Server Action |
| 이미지 | `<img>`로 TMDB 원본(w500) 그대로 | `next/image`로 크기 · 포맷(webp/avif) 자동 최적화, lazy loading |
| 폰트 | CSS `@import` | `next/font`로 self-host · layout shift 방지 |
| SEO · 공유 미리보기 | `index.html`의 `<title>umcine</title>` 하나 | 페이지마다 `metadata`, 영화 상세는 `generateMetadata`로 `아이언맨 \| UMCine` |
| 번들 · 빌드 | Vite 설정 직접 | 내장(Turbopack), 페이지별 코드 분할 자동 |

**Q. 상황이 달라져도 Next.js가 항상 가장 좋은 선택일까요?**

아니에요. Next.js의 장점은 대부분 **"첫 화면을 빠르게, 검색 엔진이 읽을 수 있게"**에서 나와요. 그 장점이 필요 없는 곳에서는 비용만 남아요.

- **고객 대상 서비스 (쇼핑몰, 블로그, UMCine 같은 영화 소개)** → Next.js가 유리해요.
  검색 노출(SEO), 링크 공유 미리보기(OG), 느린 모바일 환경의 첫 화면 속도가 매출 · 유입과 직결돼요.
- **사내 서비스 (관리자 페이지, 대시보드)** → Vite + 라우터 SPA로 충분한 경우가 많아요.
  로그인 뒤에만 쓰니 SEO가 필요 없고, 사용자가 같은 화면을 오래 켜 두어 첫 로딩보다 상호작용이 중요해요. 정적 파일만 S3 · CDN에 올리면 되어 서버 운영 비용도 없어요.
- **Next.js의 비용**: Node 서버(또는 Vercel 같은 플랫폼) 운영, 서버/클라이언트 경계 학습, 이번 미션처럼 `localStorage` 같은 브라우저 전용 코드를 서버 렌더링에 맞게 고치는 작업이 생겨요.
- 그 밖에 서버 렌더링이 필요하지만 다른 방식을 원하면 TanStack Start, React Router(Framework Mode) 같은 대안도 있어요.

→ **"무엇이 가장 좋은가"보다 "이 서비스에 SEO · 첫 화면 속도 · 서버 기능이 필요한가"로 고르면 돼요.**

---

### 2. Server Component와 Client Component

**Q. 어떤 기준으로 나누면 좋을까요?**

기본은 **Server Component**이고, 아래 중 하나라도 필요할 때만 **Client Component**로 분리해요.

| Client Component가 필요한 경우 | UMCine 예시 |
| --- | --- |
| 상태 · 생명주기 훅 (`useState`, `useEffect`) | `search-page.tsx`의 검색 입력값 |
| 이벤트 핸들러 (`onClick`, `onSubmit`) | `bookmark-button.tsx`, 평점 폼 |
| 브라우저 API (`localStorage`, `window`, `alert`) | `auth-store.ts`의 토큰 저장 |
| Context를 쓰는 라이브러리 | `QueryClientProvider` → `providers.tsx` |
| 클라이언트 라우팅 훅 (`useRouter`, `usePathname`, `useSearchParams`) | 헤더 활성 메뉴, 페이지네이션 |

| Server Component에 두는 경우 | UMCine 예시 |
| --- | --- |
| 데이터 조회, 비밀 값 사용 | 영화 상세 `generateMetadata`에서 TMDB 조회 |
| metadata export | 모든 `page.tsx` |
| 상호작용 없는 마크업 | `footer.tsx`, 레이아웃 |

나눌 때의 원칙은 **"use client 경계를 트리의 최대한 아래(잎)로 내리기"**예요. 워크북 3.2에서 페이지 전체가 아니라 `AlertButton`만 분리한 것처럼요.
또 Server Component는 Client Component에 **children / props로 전달**할 수 있어서, `layout.tsx`(Server)가 `Providers`(Client)로 감싸도 그 안의 페이지는 계속 Server Component로 남아요.

**Q. `"use client";`를 `page.tsx` 최상단에 선언해도 될까요?**

동작은 하지만 권장하지 않아요.

1. **번들이 커져요** — `use client`는 "이 파일부터 아래로 import되는 모든 것"을 클라이언트 번들에 넣는 경계라서, 상호작용이 없는 부분까지 브라우저로 보내져요.
2. **`metadata` / `generateMetadata`를 export할 수 없어요** — 페이지별 탭 제목 · SEO 설정이 막혀요.
3. **서버에서 직접 데이터를 읽을 수 없어요** — `async` 컴포넌트로 `await fetch`를 못 하고 클라이언트에서 다시 요청해야 해요.

그래서 이번 미션에서는 `app/**/page.tsx`는 Server Component로 두고(metadata, `await params`, Suspense만 담당), 실제 화면은 `screens/*`에 `"use client"`로 분리했어요.

---

### 3. 렌더링 방식

**Q. `"use client"`가 붙은 Client Component는 브라우저에서만 렌더링될까요?**

아니에요. **Client Component도 첫 요청 때 서버에서 한 번 렌더링돼 HTML로 내려가요.** 그 뒤 브라우저가 JS를 받아 같은 컴포넌트를 다시 실행하며 이벤트를 연결하는데, 이 과정을 **hydration**이라고 해요.

- `"use client"`의 정확한 의미는 "브라우저에서만 실행"이 아니라 **"이 컴포넌트의 JS도 브라우저로 보내서 hydration하라"**예요.
- Server Component는 반대로 서버에서만 실행되고 JS가 브라우저로 가지 않아요.
- 그래서 Client Component라도 **렌더링 중에 `localStorage`, `window`를 바로 쓰면 서버에서 오류**가 나요. `useEffect`나 이벤트 핸들러처럼 브라우저에서만 실행되는 시점에 써야 해요.
- 미션에서 실제로 겪은 예: Zustand persist가 렌더링 시점에 `localStorage` 토큰을 읽으면 서버 HTML(토큰 없음 → "로그인" 버튼)과 브라우저 첫 렌더(토큰 있음 → "로그아웃" 버튼)가 달라 **hydration 불일치**가 생겨요. → `skipHydration: true`로 자동 복원을 끄고, `useEffect`에서 `rehydrate()`해서 해결했어요.

**Q. SSR · SSG · ISR · ISSG 정리**

| 방식 | HTML을 만드는 시점 | 장점 | 단점 | 어울리는 페이지 |
| --- | --- | --- | --- | --- |
| **CSR** (Client-Side Rendering) | 요청 후 **브라우저**에서 JS로 | 서버 부담 없음, 페이지 전환 빠름 | 첫 화면 느림, SEO 불리 | 8주차까지의 UMCine (Vite SPA) |
| **SSR** (Server-Side Rendering) | **요청마다 서버**에서 | 항상 최신 데이터, 사용자별 화면 가능 | 요청마다 서버 비용, 응답 대기 | 로그인 사용자별 피드, 실시간 재고 |
| **SSG** (Static Site Generation) | **빌드할 때** 한 번 | CDN에서 바로 응답 → 가장 빠름 | 빌드 이후 데이터 변경이 반영 안 됨 | 소개 페이지, 문서, 워크북의 `/new` (`○`) |
| **ISR** (Incremental Static Regeneration) | 빌드 때 만들고, **정해진 시간이 지나면 백그라운드에서 다시 생성** | SSG의 속도 + 주기적 최신화 | 갱신 전까지는 이전 데이터가 보일 수 있음 | 영화 상세, 상품 상세, 뉴스 |
| **ISSG** (Incremental Static Site Generation) | (아래 설명) | | | |

- **ISR**은 Next.js 공식 용어예요. 예전에는 `export const revalidate = 60`, Cache Components를 켠 Next.js 16에서는 `"use cache"` + `cacheLife()`로 "몇 초 동안 캐시하고 이후 다시 만들지"를 정해요. 첫 사용자에게는 캐시된 페이지를 바로 주고, 시간이 지난 뒤 요청이 오면 뒤에서 새로 만들어 교체해요(stale-while-revalidate). `revalidatePath` · `revalidateTag`로 원할 때 즉시 갱신하는 **On-demand ISR**도 있어요.
- **ISSG**는 Next.js 공식 문서에 있는 용어는 아니고, 글마다 두 가지 의미로 쓰여요.
  1. **ISR과 같은 뜻** — "정적 사이트를 점진적으로 생성한다"는 이름만 다른 표현.
  2. **요청 시점에 정적 페이지를 하나씩 늘려 가는 방식** — 빌드 때는 인기 있는 일부 경로만 만들고(`generateStaticParams`), 나머지 경로는 **처음 요청이 들어올 때 생성해 캐시한 뒤** 다음부터는 정적 페이지처럼 응답해요(`dynamicParams = true`). 영화가 수십만 편인 TMDB 상세를 빌드 때 전부 만들 수 없을 때 쓰는 방식이에요.
  → 즉 ISR이 "이미 만든 페이지를 **다시** 만드는 것(갱신)"에 초점이라면, ISSG(2번 의미)는 "아직 없는 페이지를 **새로** 만들어 늘리는 것(점진적 생성)"에 초점이 있어요. 실제로는 둘을 함께 써요.

**관계 정리 — "언제 만드느냐"의 스펙트럼**

```
빌드 시 ────────────────────────────────────────────── 요청 시
  SSG          ISSG(첫 요청 때 생성)  ISR(주기적 재생성)        SSR          CSR
  (한 번 만들고 끝)      ↑ 정적 결과를 캐시해 재사용 ↑      (매번 서버)   (매번 브라우저)
```

- SSG · ISR · ISSG는 모두 **"만든 HTML을 저장해 두고 재사용하는 정적 계열"**이고, 차이는 **언제 만들고 언제 다시 만드느냐**예요.
- SSR · CSR은 **매 요청마다 새로 만드는 동적 계열**이고, 차이는 **어디(서버/브라우저)에서 만드느냐**예요.
- Next.js 16의 **PPR(Partial Prerendering, `◐`)**은 한 페이지 안에서 이 둘을 섞어요. 워크북 4.2의 `/[id]`, 미션의 `/movies/[movieId]`처럼 헤더 · 푸터 · 로딩 화면(fallback)은 빌드 때 만들어 두고(SSG), Suspense 안의 데이터 영역만 요청 시 서버에서 만들어 스트리밍해요(SSR).
- 그리고 SSR · SSG 어느 쪽이든, 내려간 HTML 중 Client Component 부분은 브라우저에서 **hydration**되어야 상호작용이 가능해져요.

## 📢 학습 후기

<!-- 직접 작성해 주세요 -->
