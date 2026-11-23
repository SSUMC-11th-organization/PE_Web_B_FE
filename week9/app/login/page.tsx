import { GuestOnly } from "@/components/auth/guest-only";
import { LoginForm } from "@/components/auth/login-form";
import { ResetOnLeave } from "@/components/reset-on-leave";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-20 py-24">
      <GuestOnly>
        <ResetOnLeave>
          <LoginForm />
        </ResetOnLeave>
      </GuestOnly>
    </main>
  );
}
