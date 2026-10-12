"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPagination } from "@/lib/nav";

export function DocPagination() {
  const pathname = usePathname();
  const { previous, next } = getPagination(pathname);
  if (!previous && !next) return null;

  return (
    <nav className="mt-16 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
      {previous ? (
        <Link
          href={previous.href}
          className="group flex flex-col gap-1 rounded-xl border border-border p-4 transition-colors hover:border-border-strong hover:bg-bg-subtle"
        >
          <span className="flex items-center gap-1.5 text-xs text-fg-faint">
            <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="text-sm font-medium text-fg">{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={next.href}
          className="group flex flex-col items-end gap-1 rounded-xl border border-border p-4 text-right transition-colors hover:border-border-strong hover:bg-bg-subtle sm:col-start-2"
        >
          <span className="flex items-center gap-1.5 text-xs text-fg-faint">
            Next
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="text-sm font-medium text-fg">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
