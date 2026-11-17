// JWT의 payload(가운데 부분)는 base64url로 인코딩된 JSON이에요. 서명 검증은 서버가 하고, 여기서는 값만 읽어요.
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// 내 정보 응답에 memberId가 없을 때를 대비해 토큰의 memberId · id · sub에서 회원 번호를 찾아요.
export function getMemberIdFromToken(token: string | null): number | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  for (const key of ["memberId", "id", "sub"]) {
    const value = Number(payload[key]);
    if (Number.isInteger(value) && value > 0) return value;
  }
  return null;
}
