import { backendClient } from "../backend-client";
import type { AvailabilityResponse } from "./models";

type CheckEmailResponse = AvailabilityResponse;

// GET /members/email/{email}
function checkEmail(email: string) {
  return backendClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckEmailResponse>();
}

export { checkEmail, type CheckEmailResponse };
