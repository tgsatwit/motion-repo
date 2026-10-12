"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { GitBranch, Menu, X } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { SearchTrigger } from "@/components/site/search-dialog";
import { SidebarNav } from "@/components/site/sidebar";
import { ThemeToggle } from "@/components/site/theme";
import { site } from "@/site.config";
import { cn } from "@/lib/cn";

const primaryLinks = [
  { title: "Docs", href: "/docs" },
  { title: "Studio", href: "/docs/studio" },
  { title: "React", href: "/docs/react/animate" },
  { title: "JavaScript", href: "/docs/javascript/animate" },
];

export function TopNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-200",
        scrolled
          ? "border-border bg-bg/80 backdrop-blur-xl"
          : "border-transparent bg-bg",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-4 px-4 sm:px-6">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation"
          className="-ml-1 grid size-8 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg lg:hidden"
        >
          <Menu className="size-4.5" />
        </button>

        <Logo />

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {primaryLinks.map((link) => {
            const active =
              link.href === "/docs"
                ? pathname === "/docs"
                : pathname.startsWith(link.href.split("/").slice(0, 3).join("/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                  active ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchTrigger className="hidden sm:flex" />
          <ThemeToggle />
          <Link
            href={site.repo}
            target="_blank"
            rel="noreferrer"
            aria-label="Source repository"
            className="grid size-8 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
          >
            <GitBranch className="size-4" />
          </Link>
        </div>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 40 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto border-r border-border bg-bg p-4 scrollbar-thin lg:hidden"
          >
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button
                onClick={onClose}
                aria-label="Close navigation"
                className="grid size-8 place-items-center rounded-lg text-fg-muted hover:bg-bg-subtle hover:text-fg"
              >
                <X className="size-4" />
              </button>
            </div>
            <SearchTrigger className="mb-6 w-full" onNavigate={onClose} />
            <SidebarNav onNavigate={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
