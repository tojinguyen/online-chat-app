import { AuthLayout, ResetPasswordForm } from "@/components/auth";
import { AUTH_CONSTANTS } from "@/constants";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password"
      linkText="Remember your password? Sign in"
      linkHref={AUTH_CONSTANTS.ROUTES.LOGIN}
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
