"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="profile-main" role="alert">
      <h1>화면을 불러오지 못했어요.</h1>
      <button type="button" onClick={reset}>
        다시 시도
      </button>
      <Link href="/">영화 목록으로 돌아가기</Link>
    </main>
  );
}
