import type { Metadata } from "next";
import { ProfilePage } from "@/screens/members/profile-page";

export const metadata: Metadata = { title: "내 정보 | UMCine" };

export default function Page() {
    return <ProfilePage />;
}
