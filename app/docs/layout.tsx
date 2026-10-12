import { Header } from "@/components/site/Header"
import { Sidebar } from "@/components/site/Sidebar"
import { Footer } from "@/components/site/Footer"
import { PageTransition } from "@/components/site/PageTransition"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="shell">
        <aside className="sidebar">
          <Sidebar />
        </aside>
        <div className="main">
          <PageTransition>{children}</PageTransition>
          <Footer />
        </div>
      </div>
    </>
  )
}
