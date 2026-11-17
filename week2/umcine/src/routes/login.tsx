import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "../pages/auth/login-page";
import { redirectIfLoggedIn } from "../utils/members/redirect-if-logged-in";

export const Route = createFileRoute("/login")({
    beforeLoad: redirectIfLoggedIn,
    component: LoginPage,
});
