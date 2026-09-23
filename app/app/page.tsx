import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Hero } from "@/components/marketing/hero"
import { ToolsPreview } from "@/components/marketing/tools-preview"
import { CommunityBand } from "@/components/marketing/community-band"
import { BrandPaths } from "@/components/marketing/brand-paths"
import { LabShowcase } from "@/components/marketing/lab-showcase"
import { ServicesCta } from "@/components/marketing/services-cta"

// One journey: plan with the tools, learn with the community, get help
// building, then inspect the real lab that proves the work behind it.
export default function HomePage() {
  return (
    <>
      <TopNav />
      <main>
        <Hero />
        <BrandPaths />
        <LabShowcase />
        <ToolsPreview />
        <CommunityBand />
        <ServicesCta />
      </main>
      <Footer />
    </>
  )
}
