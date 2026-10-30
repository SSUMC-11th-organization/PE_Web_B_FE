import { backendClient } from "../backend-client";
import type { AvailabilityResponse } from "./models";

type CheckNicknameResponse = AvailabilityResponse;

// GET /members/nickname/{nickname} — 한글 닉네임도 안전하게 보내려고 인코딩해요.
function checkNickname(nickname: string) {
  return backendClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckNicknameResponse>();
}

export { checkNickname, type CheckNicknameResponse };
