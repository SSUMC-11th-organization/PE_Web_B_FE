import { createFileRoute } from "@tanstack/react-router";
import { MyInfoPage } from "@/pages/my-info/my-info-page";

export const Route = createFileRoute("/(auth)/my-info/")({ component: MyInfoPage });
