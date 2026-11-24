// 여러 화면에서 같은 캐시를 쓰도록 query key를 한곳에서 관리해요.
export const memberKeys = {
    me: ["members", "me"] as const,
};

export const favoriteKeys = {
    all: ["favorites"] as const,
    list: ["favorites", "list"] as const,
    status: (movieId: number) => ["favorites", "status", movieId] as const,
};

export const ratingKeys = {
    byMember: (memberId: number) => ["ratings", "member", memberId] as const,
};
