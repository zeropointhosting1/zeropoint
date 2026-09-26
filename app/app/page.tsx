import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Hero } from "@/components/marketing/hero"
import { LabShowcase } from "@/components/marketing/lab-showcase"
import { WhyUs } from "@/components/marketing/why-us"
import { CaseStudiesSlot } from "@/components/marketing/case-studies-slot"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { Testimonials } from "@/components/marketing/testimonials"
import { ServicesCta } from "@/components/marketing/services-cta"
import { JsonLd } from "@/components/seo/json-ld"
import { SupportPlans } from "@/components/marketing/support-plans"
import { MeetOwner } from "@/components/marketing/meet-owner"
import { SHOW_CLIENT_WORK, SHOW_TESTIMONIALS, SITE_URL } from "@/lib/site-config"
import { BUSINESS_INFO } from "@/lib/business-info"

// Business-first homepage; client proof stays hidden until approved content exists.
export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "ZeroPoint",
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
        <SupportPlans preview />
        <WhyUs />
        <HowItWorks />
        {SHOW_CLIENT_WORK && <CaseStudiesSlot />}
        {SHOW_TESTIMONIALS && <Testimonials />}
        <MeetOwner />
        <LabShowcase />
        <ServicesCta />
      </main>
      <Footer />
    </>
  )
}
