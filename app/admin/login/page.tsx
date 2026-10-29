import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 sm:p-8">
        <h1 className="text-h3 font-semibold text-foreground">Admin sign in</h1>
        <p className="mt-1 text-small text-muted-foreground">
          Enter the admin password to manage orders.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
