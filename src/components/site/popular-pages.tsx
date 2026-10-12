import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { popularPages } from "@/site.config";
import { Reveal } from "@/components/site/reveal";

export function PopularPages() {
  return (
    <section aria-labelledby="popular" className="py-4">
      <Reveal>
        <h2 id="popular" className="text-sm font-semibold uppercase tracking-wider text-fg-faint">
          Popular pages
        </h2>
      </Reveal>

      <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {popularPages.map((column, columnIndex) => (
          <Reveal key={column.group} delay={columnIndex * 0.05}>
            <h3 className="mb-1 text-sm font-medium text-fg">{column.group}</h3>
            <ul className="divide-y divide-border">
              {column.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href!}
                    className="group flex items-center justify-between gap-3 py-2.5 text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {item.title}
                    <ArrowRight className="size-3.5 shrink-0 -translate-x-1 text-fg-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
