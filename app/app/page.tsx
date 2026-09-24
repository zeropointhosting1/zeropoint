import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Hero } from "@/components/marketing/hero"
import { ToolsPreview } from "@/components/marketing/tools-preview"
import { BrandPaths } from "@/components/marketing/brand-paths"
import { LabShowcase } from "@/components/marketing/lab-showcase"
import { WebsitesBand } from "@/components/marketing/websites-band"
import { CaseStudiesSlot } from "@/components/marketing/case-studies-slot"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { Testimonials } from "@/components/marketing/testimonials"
import { ServicesCta } from "@/components/marketing/services-cta"
import { JsonLd } from "@/components/seo/json-ld"
import { SITE_URL } from "@/lib/site-config"
import { BUSINESS_INFO } from "@/lib/business-info"

// Hero -> audience cards -> websites & dashboards -> proof (the lab, plus case studies once any
// exist) -> planning tools -> how it works -> testimonials (hidden while
// empty) -> contact CTA. Discord stays off the homepage — it's on /lab
// and /community only.
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
        <WebsitesBand />
        <LabShowcase />
        <CaseStudiesSlot />
        <ToolsPreview />
        <HowItWorks />
        <Testimonials />
        <ServicesCta />
      </main>
      <Footer />
    </>
  )
}
