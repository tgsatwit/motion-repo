import { SidebarNav } from "@/components/site/sidebar";
import { SiteFooter } from "@/components/site/footer";
import { TopNav } from "@/components/site/top-nav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <div className="mx-auto flex w-full max-w-[90rem] flex-1 px-4 sm:px-6">
        {/* Sidebar rail: sticky, independently scrollable, hidden on small screens. */}
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 pr-4 scrollbar-thin lg:block">
          <SidebarNav />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      <SiteFooter />
    </>
  );
}
