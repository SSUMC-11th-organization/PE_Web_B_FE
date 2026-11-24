"use client";

import ErrorState from "@/components/status/error-state";
import LoadingState from "@/components/status/loading-state";
import { useMeQuery } from "@/hooks/use-me-query";

function MyProfile() {
  const meQuery = useMeQuery();

  if (meQuery.isPending) return <LoadingState message="내 정보를 불러오는 중이에요." />;

  if (meQuery.isError) {
    return <ErrorState error={meQuery.error} onRetry={() => meQuery.refetch()} />;
  }

  return (
    <div className="flex items-center gap-[18px]">
      <ProfileAvatar />
      <dl className="grid grid-flow-col grid-cols-[170px_1fr] grid-rows-2 gap-y-1.5">
        <dt className="text-[11px] text-ink-3">닉네임</dt>
        <dd className="text-sm font-bold">{meQuery.data.nickname}</dd>
        <dt className="text-[11px] text-ink-3">이메일</dt>
        <dd className="text-sm font-bold">{meQuery.data.email}</dd>
      </dl>
    </div>
  );
}

function ProfileAvatar() {
  return (
    <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-line">
      <img src="/icons/movie-icons/person.svg" alt="" className="size-7" />
    </span>
  );
}

export default MyProfile;
