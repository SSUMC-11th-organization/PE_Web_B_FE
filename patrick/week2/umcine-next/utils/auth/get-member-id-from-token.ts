// 로그인 토큰(JWT)의 payload에서 memberId(sub)를 꺼내요.
// 내 정보 조회 응답에는 memberId가 없어서, 유저별 평점 조회에는 토큰의 sub를 사용해요.
// 디코딩은 값을 읽기만 할 뿐, 토큰이 진짜인지는 서버가 검증해요.
export function getMemberIdFromToken(accessToken: string | null): number | null {
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const { sub } = JSON.parse(atob(padded)) as { sub?: string | number };

    const memberId = Number(sub);
    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
