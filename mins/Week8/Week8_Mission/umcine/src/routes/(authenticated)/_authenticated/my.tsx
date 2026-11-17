import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/(authenticated)/_authenticated/my")({
  beforeLoad: () => {
    throw redirect({ to: "/profile" });
  },
});
