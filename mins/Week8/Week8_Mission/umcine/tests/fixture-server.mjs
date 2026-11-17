// 개발 검증 전용 메모리 API. 실제 인증이나 외부 서버를 대체하지 않는다.
import http from "node:http";

export function createFixtureServer() {
  let nextMemberId = 3, nextFavoriteId = 1, nextRatingId = 1;
  const members = [
    { memberId: 1, email: "study8@example.com", password: "Study8!Abc", nickname: "민스테스트", createdAt: new Date().toISOString() },
    { memberId: 2, email: "other8@example.com", password: "Study8!Abc", nickname: "다른회원", createdAt: new Date().toISOString() },
  ];
  let favorites = [], ratings = [], failNext = null;
  const requests = [], expired = new Set();
  const token = (id) => `${Buffer.from('{"alg":"none"}').toString('base64url')}.${Buffer.from(JSON.stringify({ sub: id })).toString('base64url')}.fixture-only`;
  const movies = [
    { id: 550, title: "파이트 클럽", original_title: "Fight Club", overview: "로컬 검증용 영화 정보입니다.", release_date: "1999-10-15", poster_path: null, backdrop_path: null, genres: [{ id: 18, name: "드라마" }], runtime: 139, tagline: "테스트 영화", vote_average: 8.4, vote_count: 100, genre_ids: [18] },
    { id: 27205, title: "인셉션", original_title: "Inception", overview: "즐겨찾기와 평점 검증용 영화입니다.", release_date: "2010-07-16", poster_path: null, backdrop_path: null, genres: [{ id: 878, name: "SF" }], runtime: 148, tagline: "꿈의 세계", vote_average: 8.3, vote_count: 100, genre_ids: [878] },
  ];
  return http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5188");
    res.setHeader("Access-Control-Allow-Headers", "authorization,content-type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }
    const url = new URL(req.url, "http://127.0.0.1:8098");
    const path = decodeURIComponent(url.pathname), method = req.method;
    let raw = ""; for await (const chunk of req) raw += chunk;
    const body = raw ? JSON.parse(raw) : {};
    const send = (data, status = 200) => { res.writeHead(status); res.end(JSON.stringify(data)); };
    const ok = (result, status = 200) => send({ isSuccess: true, code: `COMMON${status}`, message: "요청에 성공했어요.", result }, status);
    const error = (message, status = 400) => send({ isSuccess: false, code: `COMMON${status}`, message, result: null }, status);
    if (path === "/__test/requests") return send(requests);
    if (path === "/__test/fail-next" && method === "POST") { failNext = body; return ok(null); }
    if (path === "/__test/expire" && method === "POST") { expired.add(1); return ok(null); }
    requests.push({ method, path, bodyKeys: Object.keys(body) });
    await new Promise((resolve) => setTimeout(resolve, 160));
    if (failNext && failNext.path === path && failNext.method === method) { const status = failNext.status ?? 500; failNext = null; return error("검증용 요청 실패", status); }
    if (path.startsWith("/tmdb/")) {
      if (path === "/tmdb/movie/popular" || path === "/tmdb/search/movie") {
        const query = url.searchParams.get("query");
        const results = query ? movies.filter((movie) => movie.title.includes(query)) : movies;
        return send({ page: 1, total_pages: 1, total_results: results.length, results });
      }
      const movie = movies.find((item) => item.id === Number(path.split("/").at(-1)));
      return movie ? send(movie) : error("영화를 찾을 수 없어요.", 404);
    }
    if (path.startsWith("/v8/members/email/")) return send({ available: !members.some((item) => item.email === path.split("/").at(-1)) });
    if (path.startsWith("/v8/members/nickname/")) return send({ available: !members.some((item) => item.nickname === path.split("/").at(-1)) });
    if (path === "/v8/members" && method === "POST") {
      if (members.some((item) => item.email === body.email || item.nickname === body.nickname)) return error("이미 사용 중인 이메일 또는 닉네임이에요.", 409);
      const member = { ...body, memberId: nextMemberId++, createdAt: new Date().toISOString() }; members.push(member);
      return ok({ memberId: member.memberId, email: member.email, nickname: member.nickname }, 201);
    }
    if (path === "/v8/auth/login" && method === "POST") {
      const member = members.find((item) => item.email === body.email && item.password === body.password);
      if (!member) return error("이메일 또는 비밀번호가 올바르지 않습니다.", 401);
      expired.delete(member.memberId);
      return ok({ nickname: member.nickname, accessToken: token(member.memberId) });
    }
    const publicRatings = path.match(/^\/v8\/members\/(\d+)\/ratings$/);
    if (publicRatings) return send(ratings.filter((item) => item.memberId === Number(publicRatings[1])).map(({ memberId, ...item }) => item));
    const member = members.find((item) => req.headers.authorization === `Bearer ${token(item.memberId)}`);
    if (!member || expired.has(member.memberId)) return error("다시 로그인해 주세요.", 401);
    if (path === "/v8/members/me") {
      if (method === "PATCH") {
        if (members.some((item) => item.memberId !== member.memberId && item.nickname === body.nickname)) return error("이미 사용 중인 닉네임이에요.", 409);
        member.nickname = body.nickname;
      }
      return ok({ email: member.email, nickname: member.nickname, createdAt: member.createdAt });
    }
    if (path === "/v8/favorites") {
      if (method === "GET") return ok(favorites.filter((item) => item.memberId === member.memberId).map(({ memberId, ...item }) => item));
      if (method === "POST") {
        if (favorites.some((item) => item.memberId === member.memberId && item.movieId === body.movieId)) return error("이미 즐겨찾기한 영화예요.", 409);
        const item = { favoriteId: nextFavoriteId++, movieId: body.movieId, memberId: member.memberId, createdAt: new Date().toISOString() }; favorites.unshift(item);
        const { memberId, ...result } = item; return ok(result, 201);
      }
    }
    const status = path.match(/^\/v8\/favorites\/(\d+)$/);
    if (status) {
      const movieId = Number(status[1]);
      if (method === "GET") return ok({ isFavorite: favorites.some((item) => item.memberId === member.memberId && item.movieId === movieId) });
      if (method === "DELETE") { favorites = favorites.filter((item) => !(item.memberId === member.memberId && item.movieId === movieId)); return ok(null); }
    }
    if (path === "/v8/ratings" && method === "POST") {
      if (ratings.some((item) => item.memberId === member.memberId && item.movieId === body.movieId)) return error("이미 평점을 남긴 영화예요.", 409);
      const item = { ...body, ratingId: nextRatingId++, memberId: member.memberId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; ratings.unshift(item);
      const { memberId, ...result } = item; return ok(result, 201);
    }
    const ratingPath = path.match(/^\/v8\/ratings\/(\d+)$/);
    if (ratingPath) {
      const item = ratings.find((entry) => entry.ratingId === Number(ratingPath[1]) && entry.memberId === member.memberId);
      if (!item) return error("평점을 찾을 수 없어요.", 404);
      if (method === "DELETE") { ratings = ratings.filter((entry) => entry !== item); return ok(null); }
      if (method === "PATCH") { Object.assign(item, body, { updatedAt: new Date().toISOString() }); const { memberId, ...result } = item; return ok(result); }
    }
    return error("요청 경로가 없어요.", 404);
  });
}
