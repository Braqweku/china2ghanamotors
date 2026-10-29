import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";

export function AdminBar() {
  return (
    <div className="border-b border-border bg-muted/40">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <nav aria-label="Admin" className="flex items-center gap-5 text-small">
          <span className="font-semibold text-foreground">Admin</span>
          <Link href="/admin/orders" className="text-muted-foreground hover:text-foreground">
            Orders
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden items-center gap-1 text-small text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            View site
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
