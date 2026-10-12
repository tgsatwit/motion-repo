import { DocPagination } from "@/components/docs/pagination";
import { TableOfContents } from "@/components/docs/toc";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-8">
      <article
        id="doc-content"
        className="min-w-0 max-w-2xl flex-1 py-10 lg:px-8"
      >
        {children}
        <DocPagination />
      </article>

      {/* Right rail. Hidden below xl where there is no room for a third column. */}
      <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-52 shrink-0 overflow-y-auto py-10 scrollbar-thin xl:block">
        <TableOfContents />
      </aside>
    </div>
  );
}
