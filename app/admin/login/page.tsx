import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="text-h2 font-semibold text-foreground">Admin sign in</h1>
      <p className="mt-2 text-body text-muted-foreground">
        Enter the admin password to manage orders.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
