"use client";

import { Button } from "@/components/ui/button";
import { logoutAdminAction } from "@/lib/admin-actions";

export function LogoutButton() {
  return (
    <form action={logoutAdminAction}>
      <Button type="submit" variant="outline" size="sm">
        Sign out
      </Button>
    </form>
  );
}
