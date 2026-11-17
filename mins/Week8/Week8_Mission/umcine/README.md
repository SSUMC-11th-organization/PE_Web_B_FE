# 8주차 UMCine

TanStack Query로 회원가입·로그인·회원 정보·즐겨찾기·평점 API를 연결한 영화 앱입니다.

## 실행

```powershell
pnpm install --frozen-lockfile
pnpm dev --host 127.0.0.1 --port 5189
```

기존 `.env.local`은 유지합니다. 처음 실행한다면 `.env.example`을 `.env.local`로 복사하고 본인 TMDB 읽기 토큰을 입력합니다.

- `VITE_API_BASE_URL`: `https://workbook.devnoco.com/v8`
- `VITE_TMDB_API_BASE_URL`: `https://api.themoviedb.org/3`
- `VITE_TMDB_ACCESS_TOKEN`: 본인 TMDB 읽기 토큰

회원 API는 배포된 실습 서버를 사용하므로 별도 백엔드를 실행하지 않습니다. 실제 로그인은 해당 서버에서 회원가입한 계정으로만 가능합니다.

## 구현

| 경로 | 기능 |
| --- | --- |
| `/signup` | 입력 검증·중복 확인, useMutation 회원가입 |
| `/login` | 로그인, 토큰 저장, 내 정보 무효화, 홈 이동 |
| `/profile`, `/my` | 인증 전용 레이아웃, 내 정보와 서버 즐겨찾기 목록 |
| `/profile/edit` | 닉네임 수정 후 응답으로 회원 캐시 직접 갱신 |
| `/movies/$movieId` | 즐겨찾기 상태·등록·삭제, 내 평점 조회·등록·수정·삭제 |

`(authenticated)` Route Group과 `_authenticated` pathless Layout Route로 인증 화면을 묶고 `<Outlet />`을 사용합니다. 토큰이 없으면 로그인으로 이동하며, 서버의 401 응답이면 토큰과 회원 관련 캐시를 지웁니다. 로그인 토큰만 Zustand persist에 저장하고 회원 정보·즐겨찾기·평점은 Query 캐시에서 관리합니다.

현재 실습 API는 닉네임 수정만 지원합니다. 이메일·프로필 이미지는 읽기 전용이며 회원 탈퇴 API는 이번 범위에 포함하지 않았습니다. 즐겨찾기 응답에는 영화 ID만 있으므로 영화 제목·포스터는 TMDB 상세 조회로 보완합니다. 평점 목록 조회에 필요한 회원 번호는 JWT의 `sub`에서 읽고, 권한 검증은 서버에 맡깁니다.

## 검증

```powershell
pnpm fix
pnpm check
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

`pnpm test`는 실제 요청 함수를 로컬 메모리 API에 연결해 응답 형식, 즐겨찾기·평점 CRUD, 401 캐시 정리와 계정 변경 경쟁 상황을 검사합니다. 외부 서버 계정을 만들지 않습니다.

화면 테스트용으로 `pnpm dev:fixture`를 실행하면 `http://127.0.0.1:5188`을 사용합니다. 가상 계정은 `study8@example.com` / `Study8!Abc`이며, 해당 명령에서만 동작합니다. 서버 재시작 시 데이터가 초기화되고 영화 이미지는 생략됩니다. 일반 `pnpm dev`는 공식 서버를 사용합니다.

구현 근거와 확인 범위는 `MISSION.md`, 본인 계정 검증 및 캡처 순서는 `SUBMISSION.md`에 정리했습니다.

## 참고

- [실습 API 문서](https://workbook.devnoco.com/docs)
- [Route Group·Pathless Layout](https://tanstack.com/router/latest/docs/routing/file-naming-conventions)
- [Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [응답으로 캐시 갱신](https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses)
