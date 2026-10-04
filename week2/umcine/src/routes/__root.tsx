import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
    component: () => (
        <div className="flex min-h-svh flex-col bg-page text-ink">
            <Header />
            <Outlet />
            <Footer />
        </div>
    ),
    notFoundComponent: () => (
        <main className="flex flex-1 items-center justify-center px-4 py-20 text-sm text-ink-tertiary">
            페이지를 찾을 수 없어요.
        </main>
    ),
});
