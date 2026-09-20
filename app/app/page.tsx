import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Hero } from "@/components/marketing/hero"
import { ToolsPreview } from "@/components/marketing/tools-preview"
import { ServicesBand } from "@/components/marketing/services-band"
import { CommunityBand } from "@/components/marketing/community-band"
import { NetworkTeaser } from "@/components/marketing/network-teaser"

// One journey: plan with the tools, learn with the community, get help
// building, then inspect the real lab that proves the work behind it.
export default function HomePage() {
  return (
    <>
      <TopNav />
      <main>
        <Hero />
        <ToolsPreview />
        <CommunityBand />
        <ServicesBand />
        <NetworkTeaser />
      </main>
      <Footer />
    </>
  )
}
