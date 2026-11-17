# 8주차 미션 기록

## 핵심 구현

- `hooks/use-signup-mutation.ts`: 회원가입을 useMutation으로 옮기고 진행·성공·실패 상태와 중복 제출을 관리한다.
- `stores/auth-store.ts`, `api/auth-api.ts`: 토큰만 persist에 저장하고 인증 요청 직전에 Bearer 헤더를 넣는다. 401이면 해당 세션의 토큰·개인 캐시를 지운다. 이전 계정의 늦은 응답으로 새 계정이 로그아웃되지 않도록 요청 토큰을 비교한다.
- `hooks/use-login-mutation.ts`: 성공 시 토큰 저장, 기존 개인 캐시 정리, 회원 정보 invalidateQueries, 홈 이동. 로그인된 사용자의 `/login` 진입은 홈으로 돌린다.
- `api/members/me.ts`: `["members", "me"]`, 토큰 조건부 조회, staleTime 5분, 인증 실패 자동 재시도 없음.
- `hooks/use-update-me-mutation.ts`: PATCH 응답을 같은 회원 정보 키에 setQueryData하여 헤더와 프로필에 반영한다.
- `routes/(authenticated)/_authenticated/route.tsx`: Route Group과 공통 pathless Layout Route. `<Outlet />`으로 `/profile`, `/profile/edit`, `/my` 하위 화면을 표시하며 로그인 상태를 확인한다.
- `api/favorites/favorites.ts`, `hooks/use-favorite-mutation.ts`: 목록·상태 조회 및 추가·삭제. 상세 상태 캐시는 성공 결과로 직접 바꾸고 목록 캐시는 무효화한다. 삭제 경로에는 favoriteId가 아닌 movieId를 사용한다.
- `components/profile/favorites-grid.tsx`: 서버 목록을 페이지로 나누고 TMDB에서 영화 정보를 조회한다. 로딩·빈 목록·오류·재시도와 삭제를 제공한다.
- `api/ratings/ratings.ts`, `hooks/use-rating-mutation.ts`, `components/movies/rating-panel.tsx`: 평점 목록의 배열 응답과 변경 API의 result 응답을 구분한다. 1~5점 및 후기 최대 500자를 검사하고 등록·수정·삭제 응답으로 캐시를 갱신한다.

## 캐시 갱신 선택

로그인은 변경된 회원 정보를 다시 받아야 하므로 invalidateQueries를 사용한다. 닉네임 수정은 서버 응답에 최신 회원 정보 전체가 있어 setQueryData를 사용한다. 즐겨찾기는 상세 상태를 직접 갱신하고 목록을 다시 조회한다. 평점은 변경된 평점 응답으로 기존 배열을 불변 갱신한다. 회원 정보를 별도 전역 store에 중복 저장하지 않는다.

## 확인 결과와 범위

- 로컬 API 자동 테스트 6개 통과: 가입 본문·중복·로그인 실패, 회원 조회·수정·업무 실패, 즐겨찾기 전체 API, 평점 전체 API, 401 캐시 정리, 이전 계정의 늦은 401 처리.
- 로컬 브라우저: 비로그인 보호 경로 이동, 잘못된 로그인 후 재시도, 로그인 후 헤더와 프로필, 닉네임 중복 실패 후 정상 저장, 새로고침 후 로그인 유지, 로그인 중 `/login` 접근 제한, 인증 만료 후 로그인 이동 확인.
- 로컬 브라우저: 닉네임 저장 후 헤더·프로필 즉시 갱신 및 추가 GET /members/me 없음 확인.
- 로컬 브라우저: 즐겨찾기 등록·프로필 목록·삭제 반영, 평점 4점 등록 후 5점·후기 수정 반영 확인.
- 작성자가 공식 실습 서버의 본인 계정으로 회원가입·로그인, 헤더 닉네임 표시, 닉네임 수정 후 헤더·프로필 반영, 즐겨찾기 추가·목록·삭제, 평점 4점 등록·5점 수정·새로고침·삭제, 로그아웃 후 보호 경로 이동을 직접 확인했다.
- 개발 서버와 API 테스트가 Vite 의존성 캐시를 공유하면서 홈 화면 동적 모듈 로딩이 실패했다. 테스트의 cacheDir를 분리하고 개발 캐시를 재생성했다. 테스트 6개 통과 후 회원가입 화면에서 홈으로 이동해 정상 로딩을 확인했다.

`pnpm fix`, `pnpm check`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`를 모두 통과했다. 390px 화면에서 프로필·영화 상세의 가로 넘침이 없는 것도 확인했다. 선택 미션의 mutationOptions 리팩터링과 낙관적 업데이트는 진행하지 않았다.
