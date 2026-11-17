// 서버가 발급한 토큰의 sub는 평점 조회 URL을 구성하는 데만 사용한다.
// 디코딩은 서명 검증이 아니며, 접근 권한은 서버가 검증한다.
export function getMemberId(token: string | null): number | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as {
      sub?: string | number;
    };
    const id = Number(claims.sub);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}
