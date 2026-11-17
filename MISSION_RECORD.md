# 8주차 미션 기록 (초안)

## 워크북 실습

| 단원 | 파일 |
| --- | --- |
| 1. 회원가입 → useMutation | `src/hooks/use-signup-mutation.ts`, `src/pages/auth/signup-page.tsx` (`isSubmitting` 제거 → `signupMutation.isPending`) |
| 2. 로그인 · 토큰 저장 | `src/stores/auth-store.ts`, `src/api/auth-api.ts`, `src/api/auth/login.ts`, `src/hooks/use-login-mutation.ts`, `src/routes/login.tsx`(beforeLoad) |
| 2. 내 정보 조회 · 헤더 | `src/api/members/me.ts`, `src/hooks/use-me.ts`, `src/components/layout/header.tsx` |
| 3. setQueryData | `src/api/members/update-me.ts`, `src/hooks/use-update-me-mutation.ts`, `src/pages/members/my-edit-page.tsx` |

## 필수 미션

### 1. 로그인 전용 폴더 (Route Group + Layout Route)

```
src/routes/(protected)/
├── route.tsx      ← 공통 Layout Route: beforeLoad로 접근 제한 + <Outlet />
└── my/
    ├── index.tsx  ← /my
    └── edit.tsx   ← /my/edit
```

```tsx
export const Route = createFileRoute("/(protected)")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) throw redirect({ to: "/login" });
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  if (!accessToken) return <Navigate to="/login" />; // 보는 중 401로 토큰이 비워진 경우
  return <Outlet />;
}
```

- `(protected)`는 URL에 포함되지 않아요 (`/my`, `/my/edit` 그대로).
- `routeTree.gen.ts`에서 `/my`, `/my/edit`의 `getParentRoute`가 `protectedRouteRoute`로 생성된 것을 확인했어요.

### 2. 남은 API 연결

| API | 위치 | 캐시 갱신 |
| --- | --- | --- |
| `GET /favorites` | 마이페이지 즐겨찾기 목록, 영화 카드 북마크 상태 (`favoriteKeys.list`) | — |
| `GET /favorites/{movieId}` | 영화 상세 북마크 상태 (`favoriteKeys.status`) | — |
| `POST /favorites` / `DELETE /favorites/{movieId}` | `BookmarkButton` → `useToggleFavoriteMutation` | 낙관적 `setQueryData` → 실패 시 롤백 → `onSettled`에서 `invalidateQueries` |
| `GET /members/{memberId}/ratings` | 마이페이지 내 평점, 영화 상세 내 평점 | — |
| `POST /ratings` | 상세 `MyRatingSection` | `invalidateQueries` (ratingId는 서버가 생성) |
| `PATCH /ratings/{ratingId}` | 상세 `MyRatingSection` | 요청 값으로 `setQueryData` |
| `DELETE /ratings/{ratingId}` | 상세 `MyRatingSection` | 목록에서 제거하는 `setQueryData` |

- 4주차 localStorage 북마크(`bookmark-store`)와 화면 확인용 `profile-store`는 삭제하고 서버 상태(query 캐시)로 바꿨어요.
- 카드 20개가 각자 `GET /favorites/{id}`를 보내지 않도록, 카드는 `GET /favorites` 한 번의 결과를 `select`로 나눠 써요.
- 내 회원 번호는 `/members/me` 응답의 `memberId` → 없으면 JWT payload의 `memberId`/`id`/`sub`에서 읽어요 (`src/utils/auth/jwt.ts`).
- 로그아웃 시 토큰과 사용자별 캐시(`members`, `favorites`)를 함께 지워 다른 계정에서 이전 정보가 보이지 않게 했어요.

## 선택 미션

### invalidateQueries vs setQueryData

| | invalidateQueries | setQueryData |
| --- | --- | --- |
| 추가 요청 | 있음 (사용 중인 query는 바로 GET) | 없음 |
| 화면 반영 | 응답이 와야 반영 (그동안 이전 데이터/로딩) | 즉시 반영 |
| 정확도 | 서버 값 그대로라 항상 정확 | 내가 만든 값이 서버와 다를 위험 |
| 적용한 곳 | 로그인 후 내 정보, 평점 등록, 즐겨찾기 onSettled | 내 정보 수정(응답 result), 평점 수정(요청 값), 평점 삭제, 즐겨찾기 낙관적 업데이트 |

**선택 기준**: 응답에 바뀐 결과가 그대로 담겨 있거나 결과를 확실히 계산할 수 있으면 `setQueryData`, 서버가 값을 만들거나(id, 시각) 다른 데이터까지 함께 바뀌면 `invalidateQueries`를 써요.

### mutationOptions 리팩터링

`src/api/mutations.ts`에 `mutationKey` + `mutationFn`을 모으고, 훅에서 펼쳐 쓰며 화면별 처리만 덧붙였어요.

```ts
export const authMutations = {
  login: () => mutationOptions({ mutationKey: ["auth", "login"], mutationFn: login }),
  signup: () => mutationOptions({ mutationKey: ["members", "signup"], mutationFn: signup }),
};

// use-login-mutation.ts
return useMutation({ ...authMutations.login(), onSuccess: ..., onError: ... });
```

### 심화: 낙관적 업데이트 (즐겨찾기)

`onMutate`에서 `cancelQueries` → 이전 값 저장 → `setQueryData`로 먼저 변경 → `onError`에서 저장한 값으로 롤백 → `onSettled`에서 `invalidateQueries`로 서버와 다시 맞춰요.
