import { createFileRoute } from "@tanstack/react-router";
import { ProfileEditPage } from "@/pages/members/profile-edit-page";

export const Route = createFileRoute("/(member)/_auth/profile/edit")({
    component: ProfileEditPage,
});
