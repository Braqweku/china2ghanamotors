import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-h1 font-semibold text-foreground">Page not found</h1>
      <p className="text-body text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Button asChild>
        <Link href="/">Back to homepage</Link>
      </Button>
    </div>
  );
}
