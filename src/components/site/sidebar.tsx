"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { nav } from "@/site.config";
import { cn } from "@/lib/cn";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="flex flex-col gap-7 pb-16">
      {nav.map((group) => (
        <div key={group.title}>
          <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-fg-faint">
            {group.title}
          </h2>
          <ul className="flex flex-col gap-px">
            {group.items.map((item) => {
              const active = item.href === pathname;

              if (!item.href || item.disabled) {
                return (
                  <li key={item.title}>
                    <span className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-1.5 text-sm text-fg-faint/70">
                      {item.title}
                      {item.badge && <Badge tone="muted">{item.badge}</Badge>}
                    </span>
                  </li>
                );
              }

              return (
                <li key={item.href} className="relative">
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      transition={{ type: "spring", stiffness: 480, damping: 40 }}
                      className="absolute inset-0 rounded-lg bg-accent-soft"
                    />
                  )}
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "font-medium text-accent"
                        : "text-fg-muted hover:bg-bg-subtle hover:text-fg",
                    )}
                  >
                    {item.title}
                    {item.badge && <Badge>{item.badge}</Badge>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Badge({
  children,
  tone = "accent",
}: {
  children: React.ReactNode;
  tone?: "accent" | "muted";
}) {
  return (
    <span
      className={cn(
        "rounded border px-1.5 py-px text-[10px] font-medium uppercase tracking-wide",
        tone === "accent"
          ? "border-accent/30 bg-accent-soft text-accent"
          : "border-border text-fg-faint",
      )}
    >
      {children}
    </span>
  );
}
