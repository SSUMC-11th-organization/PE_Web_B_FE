import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "@/pages/auth/signup-page";
import { redirectIfLoggedIn } from "@/utils/members/redirect-if-logged-in";

export const Route = createFileRoute("/signup")({
    beforeLoad: redirectIfLoggedIn,
    component: SignupPage,
});
