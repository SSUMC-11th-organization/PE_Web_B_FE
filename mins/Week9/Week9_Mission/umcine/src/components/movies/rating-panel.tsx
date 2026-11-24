"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { type SubmitEvent, useState } from "react";
import { memberQueries } from "../../api/members/me";
import { type Rating, ratingQueries } from "../../api/ratings/ratings";
import { useRatingMutation } from "../../hooks/use-rating-mutation";
import { useAuthStore } from "../../stores/auth-store";
import { getMemberId } from "../../utils/auth";
import { cn } from "../../utils/cn";

export function RatingPanel({ movieId }: { movieId: number }) {
  const token = useAuthStore((state) => state.accessToken);
  const me = useQuery(memberQueries.me(token));
  const memberId = getMemberId(token);
  const ratings = useQuery(ratingQueries.member(memberId, me.isSuccess ? token : null));
  if (!token)
    return (
      <section className="rating-panel">
        <h2>내 평점</h2>
        <p className="mt-3 text-sm">
          평점을 남기려면{" "}
          <Link className="text-blue-600 underline" href="/login">
            로그인
          </Link>
          해 주세요.
        </p>
      </section>
    );
  if (me.isLoading || ratings.isLoading)
    return (
      <section className="rating-panel" role="status">
        내 평점을 불러오는 중이에요.
      </section>
    );
  if (me.isError || !memberId || ratings.isError)
    return (
      <section className="rating-panel" role="alert">
        <p>
          {!memberId
            ? "회원 번호를 확인할 수 없어요. 로그아웃 후 다시 로그인해 주세요."
            : "내 평점을 불러오지 못했어요."}
        </p>
        <button
          type="button"
          onClick={() => {
            void me.refetch();
            if (memberId) void ratings.refetch();
          }}
        >
          다시 시도
        </button>
      </section>
    );
  const existing = ratings.data?.find((rating) => rating.movieId === movieId);
  return (
    <RatingForm
      key={`${memberId}-${existing?.ratingId ?? "new"}-${existing?.updatedAt ?? ""}`}
      memberId={memberId}
      movieId={movieId}
      existing={existing}
    />
  );
}
function RatingForm({
  memberId,
  movieId,
  existing,
}: {
  memberId: number;
  movieId: number;
  existing?: Rating;
}) {
  const [score, setScore] = useState(existing?.score ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const mutation = useRatingMutation(memberId);
  const valid = Number.isInteger(score) && score >= 1 && score <= 5 && comment.length <= 500;
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || mutation.isPending) return;
    const body = { score, comment: comment.trim() };
    mutation.mutate(
      existing
        ? { type: "update", ratingId: existing.ratingId, body }
        : { type: "create", body: { ...body, movieId } },
    );
  }
  return (
    <form className="rating-panel" onSubmit={handleSubmit}>
      <h2>내 평점</h2>
      <p className="mt-2 text-xs text-[#969da8]">별점은 필수, 후기는 선택이에요. (최대 500자)</p>
      {existing && (
        <p className="mt-2 text-xs text-blue-600" role="status">
          저장된 평점: {existing.score}점
        </p>
      )}
      <fieldset className="mt-2 flex gap-1" aria-label="영화 별점" disabled={mutation.isPending}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            type="button"
            key={value}
            aria-label={`${value}점`}
            aria-pressed={score === value}
            onClick={() => setScore(value)}
            className={cn(
              "flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-[#e3e6eb]",
              value <= score ? "bg-[#2563eb]" : "bg-white",
            )}
          >
            <img
              className={cn(
                "h-6 w-6 opacity-60",
                value <= score && "brightness-0 invert opacity-100",
              )}
              src="/icons/star.svg"
              alt=""
            />
          </button>
        ))}
      </fieldset>
      <textarea
        className="mt-2 h-[102px] w-full resize-y rounded-lg border border-[#e3e6eb] bg-white px-3 py-4 text-[13px]"
        aria-label="영화 후기"
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        maxLength={500}
        disabled={mutation.isPending}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      <p className="text-right text-xs text-[#969da8]">{comment.length}/500</p>
      <button className="primary-button mt-2" type="submit" disabled={!valid || mutation.isPending}>
        {mutation.isPending ? "처리 중" : existing ? "평점 수정" : "평점 저장"}
      </button>
      {existing && (
        <button
          className="mt-3 w-full text-sm text-red-600 underline disabled:opacity-50"
          type="button"
          disabled={mutation.isPending}
          onClick={() => {
            if (!mutation.isPending && window.confirm("저장한 평점을 삭제할까요?"))
              mutation.mutate({ type: "delete", ratingId: existing.ratingId });
          }}
        >
          평점 삭제
        </button>
      )}
    </form>
  );
}
