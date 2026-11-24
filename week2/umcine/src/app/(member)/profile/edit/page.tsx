import type { Metadata } from "next";
import { ProfileEditPage } from "@/screens/members/profile-edit-page";

export const metadata: Metadata = { title: "내 정보 수정 | UMCine" };

export default function Page() {
    return <ProfileEditPage />;
}
