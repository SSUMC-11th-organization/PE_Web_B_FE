# 9주차 필수 미션 기록

## 구현

- 기존 기능을 유지한 Next.js App Router 마이그레이션. URL은 `/`, `/search`, `/movies/[movieId]`, `/signup`, `/login`, `/profile`, `/profile/edit`, `/my`로 유지.
- `app/layout.tsx`에 공통 레이아웃을 구성하고 `(authenticated)/layout.tsx`에서 회원 전용 화면을 감싼다. Outlet을 children으로 변경.
- TanStack Router 전용 Link·이동·URL 상태 API와 Vite 설정·환경변수를 Next.js API와 NEXT_PUBLIC 변수로 전환.
- 페이지·레이아웃은 Server Component로 유지하고 상태·이벤트·Query·Zustand를 사용하는 화면을 Client Component로 분리.
- Provider는 서버 요청별 QueryClient와 브라우저 공유 캐시를 구분한다. 토큰은 mount 이후 복원하고, 인증 복원 전 잘못된 로그인 이동이나 hydration mismatch를 방지한다.
- 영화 상세의 공개 정보는 서버에서 조회해 초기 HTML과 Query initialData로 전달한다. 서버가 받은 결과를 상세 메타데이터에도 재사용한다. 회원 토큰은 이 조회에 사용하지 않는다.
- next/image, next/font/local, 페이지별 metadata와 loading/error/not-found 화면 적용.

## 주요 코드

- `src/app/layout.tsx`, `src/app/providers.tsx`: 서버 공통 레이아웃·클라이언트 Provider 경계.
- `src/app/(authenticated)/layout.tsx`, `src/components/layout/authenticated-layout.tsx`: Route Group과 인증 완료 후 children 표시.
- `src/stores/auth-store.ts`: skipHydration·복원 완료 상태·토큰 저장.
- `src/app/movies/[movieId]/page.tsx`, `src/lib/server-movie.ts`: 비동기 params·서버 조회·메타데이터.
- `src/screens/movies/search-page.tsx`: useSearchParams·useRouter와 URL 인코딩.
- `src/components/movies/movie-image.tsx`, `next.config.ts`: 이미지 최적화와 허용 호스트.

## 트러블 슈팅

- `src/pages`는 Next.js에서 Pages Router 경로로 인식하므로 기존 화면 디렉터리를 `src/screens`로 변경했다.
- 부분 사전 렌더링 중 usePathname이 Suspense 밖에서 호출되어 빌드가 실패했다. URL 상태를 읽는 헤더에 Suspense를 두어 해결했다.
- 인증 레이아웃은 토큰 복원 전 children을 렌더링하지 않는다. Next.js 즉시 탐색 검증이 이 하위 경로를 검증할 수 없어 해당 인증 화면에만 `instant = false`를 지정했다.

검증 결과는 실제 실행 후 확인한 범위만 기록한다. 공식 서버의 회원 계정 생성·로그인·변경 작업은 자동으로 수행하지 않는다.
