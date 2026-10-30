import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="China2Ghana Motors home">
      <Image
        src="/logo/china2ghana-logo-transparent.png"
        alt="China2Ghana Motors"
        width={1020}
        height={530}
        className="h-10 w-auto"
        priority
      />
    </Link>
  );
}
