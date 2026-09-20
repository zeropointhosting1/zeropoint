import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { getDocsByCategory } from "@/lib/docs"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const groups = getDocsByCategory()

  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <DocsSidebar groups={groups} />
            </div>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  )
}
