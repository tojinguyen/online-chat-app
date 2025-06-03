import { AuthLayout, VerifyEmailForm } from "@/components/auth";

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="One last step to complete your registration"
    >
      <VerifyEmailForm />
    </AuthLayout>
  );
}
