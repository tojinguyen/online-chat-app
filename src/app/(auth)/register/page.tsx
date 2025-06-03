import { AuthLayout, RegisterForm } from "@/components/auth";
import { AUTH_CONSTANTS } from "@/constants";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Join our community today"
      linkText="Already have an account? Sign in"
      linkHref={AUTH_CONSTANTS.ROUTES.LOGIN}
    >
      <RegisterForm />
    </AuthLayout>
  );
}
