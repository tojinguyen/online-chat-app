import { AuthLayout, ForgotPasswordForm } from "@/components/auth";
import { AUTH_CONSTANTS } from "@/constants";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Reset your password"
      linkText="Remember your password? Sign in"
      linkHref={AUTH_CONSTANTS.ROUTES.LOGIN}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
