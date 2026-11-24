# 9주차 UMCine — Next.js 마이그레이션

Week8의 영화·회원·즐겨찾기·평점 기능을 유지하면서 Next.js 16 App Router로 이전했습니다. 이전 주차 프로젝트는 변경하지 않습니다.

## 실행

```powershell
pnpm install --frozen-lockfile
# 처음 설정하는 경우에만 .env.example을 .env.local로 복사하고 TMDB 토큰 입력
pnpm dev --hostname 127.0.0.1 --port 3009
```

- `NEXT_PUBLIC_API_BASE_URL`: `https://workbook.devnoco.com/v8`
- `NEXT_PUBLIC_TMDB_API_BASE_URL`: `https://api.themoviedb.org/3`
- `NEXT_PUBLIC_TMDB_ACCESS_TOKEN`: TMDB 읽기 토큰

기존 `.env.local`은 덮어쓰지 않습니다. `NEXT_PUBLIC_` 값은 브라우저 번들에 포함됩니다. 회원 비밀번호나 로그인 토큰을 환경변수에 넣지 않습니다. 회원 API는 이전 주차와 같은 실습 서버를 사용하므로 기존 계정으로 로그인할 수 있습니다.

## 라우팅과 경계

| URL | App Router 파일 | 역할 |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | 영화 목록·페이지 이동 |
| `/search?query=...` | `src/app/search/page.tsx` | 검색 URL과 결과 |
| `/movies/[movieId]` | `src/app/movies/[movieId]/page.tsx` | 서버 영화 조회·메타데이터, 클라이언트 즐겨찾기·평점 |
| `/signup` | `src/app/signup/page.tsx` | 검증·중복 확인·회원가입 |
| `/login` | `src/app/login/page.tsx` | 로그인, 로그인 상태면 홈 이동 |
| `/profile`, `/profile/edit`, `/my` | `src/app/(authenticated)/...` | 공통 인증 레이아웃, 내 정보·수정·별칭 |

- `src/app/layout.tsx`는 Server Component로 공통 레이아웃·메타데이터·next/font/local을 설정합니다. `children`으로 페이지를 조합합니다.
- `src/app/providers.tsx`만 Client Component로 Query Provider를 설치합니다. 서버 렌더링에는 요청별 QueryClient를 만들고 브라우저에서는 같은 인스턴스를 재사용합니다.
- 공개 영화 상세는 서버에서 먼저 조회합니다. metadata와 페이지는 React cache로 같은 요청의 결과를 공유하고, Query의 initialData로 브라우저에 전달해 중복 조회를 줄입니다. 서버 조회 실패 시 기존 클라이언트 오류·재시도 UI를 유지합니다.
- `src/screens`와 상호작용 컴포넌트에 `use client`를 지정합니다. 기존 `src/pages`는 Next.js Pages Router와 충돌하지 않게 `src/screens`로 옮겼습니다.
- 링크·URL 상태·이동은 `next/link`, `useRouter`, `useSearchParams`, `usePathname`, `redirect`를 사용합니다. TanStack Router, Vite 진입점·설정·생성 라우트 트리는 제거했습니다.
- Zustand persist의 자동 복원을 끄고 mount 후 복원합니다. 보호 화면은 복원·회원 조회를 기다린 뒤 표시합니다. 브라우저 API는 이벤트·effect 안에서 실행합니다. API의 실제 권한 검증은 기존 백엔드가 수행합니다.
- 로그인 상태에 따라 하위 화면을 숨기는 로그인·회원 경로에만 `instant = false`를 지정했습니다. Next.js 16.4의 즉시 탐색 개발 검증 대상에서 이 조건부 화면을 제외하며, 인증을 해제하거나 사전 렌더링을 끄는 설정이 아닙니다.
- URL을 읽는 헤더와 검색, 동적 경로는 Suspense/loading 경계를 둡니다. Cache Components와 Partial Prefetching을 사용합니다.
- 영화 포스터·배경은 next/image로 전환하고 TMDB 이미지 호스트만 허용합니다. 작은 SVG 아이콘은 기존 img를 유지합니다. Pretendard는 저장소의 폰트·라이선스를 사용하며 next/font/local로 제공합니다.

## 검증

```powershell
pnpm fix
pnpm check
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start --hostname 127.0.0.1 --port 3009
```

`pnpm test`는 로컬 메모리 API로 인증·회원 정보·즐겨찾기·평점 및 토큰 복원·캐시 분리를 검사합니다. 외부 계정은 생성하지 않습니다.

`pnpm dev:fixture`는 Next.js(3010)와 메모리 API(8099)를 함께 실행합니다. 가상 계정은 `study8@example.com` / `Study8!Abc`이며 공식 서버에서는 사용할 수 없습니다. 정상 개발·빌드와 가상 검증의 `.next` / `.next-fixture` 출력 폴더를 분리했습니다. `tsx`로 API 테스트를 실행하므로 Vite 캐시를 공유하지 않습니다. 로컬 데이터는 재시작 시 초기화되고 영화 이미지는 생략됩니다.

구현·검증 결과는 `MISSION.md`, 직접 확인과 Notion 기록 방법은 `SUBMISSION.md`에 정리했습니다.

## 공식 참고 자료

- [Vite에서 Next.js로 이전](https://nextjs.org/docs/app/guides/migrating/from-vite)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
- [조건부 하위 화면과 즉시 탐색 검증](https://nextjs.org/docs/messages/instant-unrendered-segment)
