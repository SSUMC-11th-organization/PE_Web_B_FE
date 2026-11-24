"use client";

import { Fragment, useLayoutEffect, useState, type ReactNode } from "react";

// cacheComponents를 켜면 Next.js가 떠난 화면을 없애지 않고 숨겨서 state와 DOM이 그대로 남아요.
// 비밀번호 같은 입력값이 남지 않도록 화면이 숨겨질 때 key를 바꿔 초기화해요.
export function ResetOnLeave({ children }: { children: ReactNode }) {
  const [resetKey, setResetKey] = useState(0);

  useLayoutEffect(() => {
    return () => setResetKey((prev) => prev + 1);
  }, []);

  return <Fragment key={resetKey}>{children}</Fragment>;
}
