"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useUpdateMeMutation } from "@/hooks/use-update-me-mutation";
import { useAuthStore } from "@/stores/auth-store";

export function MyInfoEditPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const updateMeMutation = useUpdateMeMutation();

  // 사용자가 입력하기 전에는 서버에서 받은 닉네임을 보여줘요
  const [nicknameInput, setNicknameInput] = useState<string | null>(null);
  const nicknameValue = nicknameInput ?? meQuery.data?.nickname ?? "";
  const nickname = nicknameValue.trim();
  const canSubmit = nickname.length >= 2 && nickname.length <= 12;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate({ nickname });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-12 pb-16">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-start justify-between py-4">
          <div>
            <h1 className="m-0 text-2xl font-bold text-gray-900">
              내 정보 수정
            </h1>
            <p className="m-0 mt-1 text-xs text-gray-500">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            disabled={!canSubmit || updateMeMutation.isPending}
            className="cursor-pointer rounded-lg border-0 bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 py-6 md:grid-cols-2">
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-7 w-7"
                  fill="currentColor"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0z" />
                </svg>
              </div>
              <button
                type="button"
                aria-label="프로필 이미지 변경"
                className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-700"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                </svg>
              </button>
            </div>
            <p className="m-0 mt-2 text-sm font-bold text-gray-900">
              프로필 이미지
            </p>
            <p className="m-0 text-xs text-gray-400">선택 사항 · 최대 5MB</p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="nickname"
                className="mb-1.5 block text-xs font-bold text-gray-900"
              >
                닉네임
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 focus-within:border-blue-600">
                <input
                  id="nickname"
                  type="text"
                  value={nicknameValue}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
                <button
                  type="button"
                  className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-blue-600"
                >
                  중복 확인
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-bold text-gray-900"
              >
                이메일
              </label>
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5">
                <input
                  id="email"
                  type="email"
                  value={meQuery.data?.email ?? ""}
                  readOnly
                  className="w-full bg-transparent text-sm text-gray-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <section className="mt-16 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
        <div>
          <h2 className="m-0 text-sm font-bold text-red-600">회원 탈퇴</h2>
          <p className="m-0 mt-1 text-xs text-red-500">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되어 복구할 수 없습니다.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 cursor-pointer rounded-lg border border-red-500 bg-white px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          회원 탈퇴
        </button>
      </section>
    </div>
  );
}