import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";
import { createFixtureServer } from "./fixture-server.mjs";

let httpServer, vite, base, api, auth, cache, response;
before(async () => {
  const storage = new Map();
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  };
  httpServer = createFixtureServer();
  await new Promise((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${httpServer.address().port}`;
  vite = await createServer({
    configFile: false,
    envDir: false,
    // 실행 중인 앱의 의존성 캐시를 테스트 설정으로 덮어쓰지 않는다.
    cacheDir: "node_modules/.vite-api-tests",
    server: { middlewareMode: true },
    define: { "import.meta.env.VITE_API_BASE_URL": JSON.stringify(`${base}/v8`) },
  });
  const load = (file) => vite.ssrLoadModule(`/src/${file}`);
  api = {
    ...await load("api/auth/login.ts"),
    ...await load("api/members/signup.ts"),
    ...await load("api/members/me.ts"),
    ...await load("api/members/update-me.ts"),
    ...await load("api/favorites/favorites.ts"),
    ...await load("api/ratings/ratings.ts"),
  };
  auth = (await load("stores/auth-store.ts")).useAuthStore;
  cache = await load("lib/query-client.ts");
  response = await load("api/response.ts");
});
after(async () => {
  await vite?.close();
  httpServer?.closeAllConnections();
  if (httpServer?.listening) await new Promise((resolve) => httpServer.close(resolve));
  cache?.queryClient.clear();
  delete globalThis.localStorage;
});

async function control(path, body) {
  const result = await fetch(`${base}/__test/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  assert.equal(result.status, 200);
}
async function signIn(email = "study8@example.com") {
  const result = await api.login({ email, password: "Study8!Abc" });
  auth.getState().setAccessToken(result.accessToken);
  return result.accessToken;
}

test("회원가입 본문, 중복 응답과 로그인 실패를 처리한다", async () => {
  const created = await api.signup({ email: "new8@example.com", nickname: "새회원8", password: "Study8!Abc" });
  assert.equal(created.isSuccess, true);
  await assert.rejects(api.signup({ email: "new8@example.com", nickname: "새회원8", password: "Study8!Abc" }), (error) => error.response.status === 409);
  await assert.rejects(api.login({ email: "new8@example.com", password: "wrong" }), (error) => error.response.status === 401);
  const loginError = await api.login({ email: "new8@example.com", password: "wrong" }).catch((error) => error);
  assert.equal(await response.errorMessage(loginError), "이메일 또는 비밀번호가 올바르지 않습니다.");
  const requests = await (await fetch(`${base}/__test/requests`)).json();
  const signup = requests.find((request) => request.method === "POST" && request.path === "/v8/members");
  assert.deepEqual(signup.bodyKeys.sort(), ["email", "nickname", "password"]);
});

test("인증 헤더로 내 정보를 조회·수정하고 업무 실패도 예외로 처리한다", async () => {
  await signIn();
  assert.equal((await api.getMe()).email, "study8@example.com");
  const updated = await api.updateMe({ nickname: "새닉네임8" });
  assert.equal(updated.nickname, "새닉네임8");
  assert.equal((await api.getMe()).nickname, "새닉네임8");
  await assert.rejects(api.updateMe({ nickname: "다른회원" }), (error) => {
    assert.equal(error.response.status, 409);
    return true;
  });
  assert.throws(() => response.unwrap({ isSuccess: false, code: "FAIL", message: "업무 실패", result: null }), /업무 실패/);
});

test("즐겨찾기 등록·목록·상태·삭제의 응답 형태와 movieId 경로가 맞다", async () => {
  await signIn();
  assert.deepEqual(await api.getFavorites(), []);
  assert.deepEqual(await api.getFavoriteStatus(550), { isFavorite: false });
  const item = await api.addFavorite(550);
  assert.equal(item.movieId, 550);
  assert.equal((await api.getFavorites())[0].movieId, 550);
  assert.deepEqual(await api.getFavoriteStatus(550), { isFavorite: true });
  await assert.rejects(api.addFavorite(550), (error) => error.response.status === 409);
  await api.deleteFavorite(550);
  assert.deepEqual(await api.getFavorites(), []);
  assert.deepEqual(await api.getFavoriteStatus(550), { isFavorite: false });
});

test("평점 조회의 배열 응답과 등록·수정·삭제를 처리한다", async () => {
  await signIn();
  assert.deepEqual(await api.getRatings(1), []);
  const created = await api.createRating({ movieId: 550, score: 4, comment: "첫 후기" });
  assert.equal(created.score, 4);
  const updated = await api.updateRating(created.ratingId, { score: 5, comment: "수정 후기" });
  assert.equal(updated.comment, "수정 후기");
  assert.equal((await api.getRatings(1))[0].score, 5);
  await api.deleteRating(created.ratingId);
  assert.deepEqual(await api.getRatings(1), []);
});

test("401 응답은 토큰과 사용자 캐시를 지우고 영화 캐시는 유지한다", async () => {
  await signIn();
  cache.queryClient.setQueryData(["members", "me"], { nickname: "old" });
  cache.queryClient.setQueryData(["favorites", "list"], [{ movieId: 550 }]);
  cache.queryClient.setQueryData(["ratings", "member", 1], []);
  cache.queryClient.setQueryData(["movies", "detail", 550], { title: "파이트 클럽" });
  await control("expire", {});
  await assert.rejects(api.getMe(), (error) => error.response.status === 401);
  assert.equal(auth.getState().accessToken, null);
  assert.equal(cache.queryClient.getQueryData(["members", "me"]), undefined);
  assert.equal(cache.queryClient.getQueryData(["favorites", "list"]), undefined);
  assert.equal(cache.queryClient.getQueryData(["ratings", "member", 1]), undefined);
  assert.equal(cache.queryClient.getQueryData(["movies", "detail", 550]).title, "파이트 클럽");
});

test("이전 계정의 늦은 401이 새 계정을 로그아웃시키지 않는다", async () => {
  await signIn();
  const second = await api.login({ email: "other8@example.com", password: "Study8!Abc" });
  await control("expire", {});
  const pending = api.getMe();
  const pendingError = pending.catch((error) => error);
  // ky가 현재 토큰으로 요청을 전송한 뒤 새 세션으로 바뀌는 상황을 재현한다.
  await new Promise((resolve) => setTimeout(resolve, 50));
  auth.getState().setAccessToken(second.accessToken);
  const error = await pendingError;
  assert.equal(error.response.status, 401);
  assert.equal(auth.getState().accessToken, second.accessToken);
  assert.equal((await api.getMe()).email, "other8@example.com");
});
