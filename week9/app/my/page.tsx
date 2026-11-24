import Link from "next/link";
import BookmarkSection from "@/components/my/bookmark-section";
import MyProfile from "@/components/my/my-profile";

// RequireAuth가 로그인 확인 전에는 화면을 그리지 않으므로 즉시 이동 검증에서 제외해요.
export const instant = false;

export default function MyPage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-20 py-8">
      <div className="flex items-center justify-between border-b border-line pb-5">
        <h1 className="text-2xl font-bold">내 정보</h1>
        <Link
          href="/my/edit"
          className="flex h-[42px] items-center rounded-lg bg-primary px-4 text-sm font-extrabold text-white hover:bg-blue-700"
        >
          정보 수정
        </Link>
      </div>

      <section className="border-b border-line py-5">
        <h2 className="mb-4 text-sm font-bold">기본 정보</h2>
        <MyProfile />
      </section>

      <section className="py-5">
        <h2 className="mb-4 text-sm font-bold">내 즐겨찾기</h2>
        <BookmarkSection />
      </section>
    </main>
  );
}
