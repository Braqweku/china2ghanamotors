import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="China2Ghana Motors home">
      <Image
        src="/logo/china2ghana-logo.png"
        alt="China2Ghana Motors"
        width={1027}
        height={537}
        className="h-10 w-auto"
        priority
      />
    </Link>
  );
}
