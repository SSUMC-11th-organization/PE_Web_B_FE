// 내 정보 API는 memberId를 주지 않아서, 로그인 토큰(JWT)의 payload에서 회원 번호를 읽어요.
// 토큰 검증은 서버가 하고, 여기서는 내 평점 목록을 조회할 번호만 꺼내요.
export function getMemberIdFromToken(accessToken: string | null): number | null {
    if (!accessToken) return null;

    try {
        const payload = accessToken.split(".")[1];
        if (!payload) return null;

        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            Array.from(atob(base64), (char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`).join(""),
        );
        const claims: Record<string, unknown> = JSON.parse(json);
        const memberId = Number(claims.memberId ?? claims.id ?? claims.sub);
        return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
    } catch {
        return null;
    }
}
