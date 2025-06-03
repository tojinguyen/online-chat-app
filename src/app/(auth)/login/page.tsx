import { AuthLayout, LoginForm } from "@/components/auth";
import { AUTH_CONSTANTS } from "@/constants";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Sign in to your account to continue"
      linkText="Don't have an account? Sign up"
      linkHref={AUTH_CONSTANTS.ROUTES.REGISTER}
    >
      <LoginForm />
    </AuthLayout>
  );
}
