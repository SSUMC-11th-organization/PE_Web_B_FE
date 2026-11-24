import { SignupForm } from "@/components/auth/signup-form";
import { ResetOnLeave } from "@/components/reset-on-leave";

export default function SignupPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-20 py-24">
      <ResetOnLeave>
        <SignupForm />
      </ResetOnLeave>
    </main>
  );
}
