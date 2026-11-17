import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Rating } from "../../api/ratings/ratings";
import { useMemberRatingsQuery, useRatingMutations } from "../../hooks/use-ratings";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";
import { getMemberIdFromToken } from "../../utils/members/get-member-id-from-token";

const COMMENT_MAX_LENGTH = 500;
const SCORES = [1, 2, 3, 4, 5];

const primaryButtonClassName =
    "flex h-9 shrink-0 cursor-pointer items-center rounded-lg bg-action px-4 text-[13px] font-extrabold text-white transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:bg-action-disabled";
const secondaryButtonClassName =
    "flex h-9 shrink-0 cursor-pointer items-center rounded-lg border border-line bg-surface px-4 text-[13px] font-extrabold text-ink-secondary transition-colors hover:text-ink disabled:cursor-not-allowed";

interface MyRatingSectionProps {
    movieId: number;
}

export function MyRatingSection({ movieId }: MyRatingSectionProps) {
    const accessToken = useAuthStore((state) => state.accessToken);
    const memberId = getMemberIdFromToken(accessToken);

    return (
        <section className="flex flex-col gap-4 border-t border-line px-4 py-6 sm:px-10 lg:px-20">
            <h2 className="text-lg font-bold text-ink">내 평점</h2>
            {!accessToken ? (
                <p className="text-sm text-ink-tertiary">
                    <Link to="/login" className="font-bold text-action hover:underline">
                        로그인
                    </Link>
                    하면 평점을 남길 수 있어요.
                </p>
            ) : memberId === null ? (
                <p className="text-sm text-ink-tertiary">회원 정보를 확인하지 못했어요. 다시 로그인해 주세요.</p>
            ) : (
                <MyRating memberId={memberId} movieId={movieId} />
            )}
        </section>
    );
}

function MyRating({ memberId, movieId }: { memberId: number; movieId: number }) {
    // GET /members/{memberId}/ratings로 내 평점 목록을 받아 이 영화의 평점을 찾아요.
    const ratingsQuery = useMemberRatingsQuery(memberId);
    const { createMutation, updateMutation, deleteMutation } = useRatingMutations(memberId);
    const [isEditing, setIsEditing] = useState(false);

    if (ratingsQuery.isPending) {
        return <p className="text-sm text-ink-tertiary">내 평점을 불러오는 중이에요.</p>;
    }
    if (ratingsQuery.isError) {
        return <p className="text-sm text-ink-tertiary">내 평점을 불러오지 못했어요.</p>;
    }

    const myRating = ratingsQuery.data.find((rating) => rating.movieId === movieId);

    if (!myRating) {
        return (
            <RatingForm
                submitLabel="등록"
                isPending={createMutation.isPending}
                onSubmit={({ score, comment }) =>
                    createMutation.mutate({ movieId, score, ...(comment && { comment }) })
                }
            />
        );
    }

    if (isEditing) {
        return (
            <RatingForm
                initialRating={myRating}
                submitLabel="저장"
                isPending={updateMutation.isPending}
                onCancel={() => setIsEditing(false)}
                onSubmit={({ score, comment }) =>
                    updateMutation.mutate(
                        // 빈 문자열을 보내면 기존 한줄평을 지울 수 있어요.
                        { ratingId: myRating.ratingId, body: { score, comment } },
                        { onSuccess: () => setIsEditing(false) },
                    )
                }
            />
        );
    }

    function handleDelete() {
        if (!myRating || !confirm("평점을 삭제할까요?")) return;
        deleteMutation.mutate(myRating.ratingId);
    }

    return (
        <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4">
            <div className="flex items-center justify-between gap-4">
                <Stars score={myRating.score} />
                <div className="flex items-center gap-2">
                    <button type="button" className={secondaryButtonClassName} onClick={() => setIsEditing(true)}>
                        수정
                    </button>
                    <button
                        type="button"
                        className={secondaryButtonClassName}
                        disabled={deleteMutation.isPending}
                        onClick={handleDelete}
                    >
                        {deleteMutation.isPending ? "삭제 중" : "삭제"}
                    </button>
                </div>
            </div>
            {myRating.comment && <p className="text-sm leading-6 text-ink-secondary">{myRating.comment}</p>}
            <p className="text-xs text-ink-tertiary">
                {new Date(myRating.updatedAt).toLocaleDateString("ko-KR")}
                {myRating.updatedAt !== myRating.createdAt && " (수정됨)"}
            </p>
        </div>
    );
}

interface RatingFormProps {
    initialRating?: Rating;
    submitLabel: string;
    isPending: boolean;
    onSubmit: (values: { score: number; comment: string }) => void;
    onCancel?: () => void;
}

function RatingForm({ initialRating, submitLabel, isPending, onSubmit, onCancel }: RatingFormProps) {
    const [score, setScore] = useState(initialRating?.score ?? 0);
    const [comment, setComment] = useState(initialRating?.comment ?? "");

    const trimmedComment = comment.trim();
    const isChanged =
        !initialRating || score !== initialRating.score || trimmedComment !== (initialRating.comment ?? "");
    const canSubmit = score >= 1 && score <= 5 && trimmedComment.length <= COMMENT_MAX_LENGTH && isChanged;

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!canSubmit || isPending) return;
        onSubmit({ score, comment: trimmedComment });
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4">
            <div className="flex items-center gap-1" role="radiogroup" aria-label="별점">
                {SCORES.map((value) => (
                    <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={score === value}
                        aria-label={`${value}점`}
                        className="cursor-pointer"
                        onClick={() => setScore(value)}
                    >
                        <img
                            className="size-7"
                            src={value <= score ? "/icons/star.svg" : "/icons/star-outline.svg"}
                            alt=""
                        />
                    </button>
                ))}
                <span className="ml-2 text-sm font-bold text-ink">{score > 0 ? `${score}점` : "별점을 선택해 주세요"}</span>
            </div>

            <textarea
                value={comment}
                maxLength={COMMENT_MAX_LENGTH}
                placeholder="한줄평을 남겨 주세요 (선택)"
                onChange={(event) => setComment(event.target.value)}
                className="min-h-20 w-full resize-y rounded-lg border border-line px-3.5 py-3 text-sm text-ink outline-none placeholder:text-ink-tertiary focus:border-ink"
            />

            <div className="flex items-center justify-between gap-4">
                <span className={cn("text-xs", comment.length >= COMMENT_MAX_LENGTH ? "text-danger" : "text-ink-tertiary")}>
                    {comment.length}/{COMMENT_MAX_LENGTH}
                </span>
                <div className="flex items-center gap-2">
                    {onCancel && (
                        <button type="button" className={secondaryButtonClassName} disabled={isPending} onClick={onCancel}>
                            취소
                        </button>
                    )}
                    <button type="submit" className={primaryButtonClassName} disabled={!canSubmit || isPending}>
                        {isPending ? `${submitLabel} 중` : submitLabel}
                    </button>
                </div>
            </div>
        </form>
    );
}

function Stars({ score }: { score: number }) {
    return (
        <div className="flex items-center gap-1" aria-label={`${score}점`}>
            {SCORES.map((value) => (
                <img
                    key={value}
                    className="size-5"
                    src={value <= score ? "/icons/star.svg" : "/icons/star-outline.svg"}
                    alt=""
                />
            ))}
            <span className="ml-1 text-sm font-bold text-ink">{score}점</span>
        </div>
    );
}
