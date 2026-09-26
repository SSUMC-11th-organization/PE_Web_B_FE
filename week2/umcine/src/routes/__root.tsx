import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
    component: () => (
        <div className="flex min-h-svh flex-col bg-white text-[#1a1a1a]">
            <Header />
            <Outlet />
        </div>
    ),
    notFoundComponent: () => (
        <main className="flex flex-1 items-center justify-center px-4 py-20 text-[15px] text-[#9a9a9a]">
            페이지를 찾을 수 없어요.
        </main>
    ),
});
