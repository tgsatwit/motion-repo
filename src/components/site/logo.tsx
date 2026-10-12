import Link from "next/link";
import { site } from "@/site.config";

/** Wordmark + an abstract "trail" mark built from three offset chevrons. */
export function Logo({ href = "/docs" }: { href?: string }) {
  return (
    <Link href={href} className="flex w-fit items-center gap-2 text-fg">
      <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
        <path
          d="M4 6.5 9 12l-5 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />
        <path
          d="M10.5 6.5 15.5 12l-5 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
        <path
          d="M17 6.5 22 12l-5 5.5"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">{site.name}</span>
    </Link>
  );
}
