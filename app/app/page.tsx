import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Hero } from "@/components/marketing/hero"
import { ToolsPreview } from "@/components/marketing/tools-preview"
import { CommunityBand } from "@/components/marketing/community-band"
import { BrandPaths } from "@/components/marketing/brand-paths"
import { LabShowcase } from "@/components/marketing/lab-showcase"
import { ServicesCta } from "@/components/marketing/services-cta"
import { JsonLd } from "@/components/seo/json-ld"
import { SITE_URL } from "@/lib/site-config"
import { BUSINESS_INFO } from "@/lib/business-info"

// One journey: plan with the tools, learn with the community, get help
// building, then inspect the real lab that proves the work behind it.
export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: BUSINESS_INFO.name,
          url: SITE_URL,
          email: BUSINESS_INFO.email,
          telephone: BUSINESS_INFO.telephone,
          areaServed: BUSINESS_INFO.areaServed,
          address: { "@type": "PostalAddress", addressLocality: BUSINESS_INFO.city },
        }}
      />
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
