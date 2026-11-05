import "./globals.css";

// Each top-level area renders its own <html>: app/[locale]/layout.tsx for the
// public site (with the visitor's language) and app/admin/layout.tsx for staff.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
