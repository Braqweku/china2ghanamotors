import { AdminBar } from "@/components/admin/admin-bar";

export default function AdminOrdersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminBar />
      {children}
    </>
  );
}
