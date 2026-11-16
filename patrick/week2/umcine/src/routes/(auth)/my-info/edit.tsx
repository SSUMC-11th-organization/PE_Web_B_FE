import { createFileRoute } from "@tanstack/react-router";
import { MyInfoEditPage } from "@/pages/my-info/my-info-edit-page";

export const Route = createFileRoute("/(auth)/my-info/edit")({
  component: MyInfoEditPage,
});
