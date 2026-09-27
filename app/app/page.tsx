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
import { StartingPricing } from "@/components/marketing/support-plans"
import { MeetOwner } from "@/components/marketing/meet-owner"
import { SHOW_CLIENT_WORK, SHOW_TESTIMONIALS, SITE_URL } from "@/lib/site-config"
import { BUSINESS_INFO } from "@/lib/business-info"

import { ServicePicker, CommonProblems, NetworkingSpecialty, TechSupportSection, NetworkCare } from "@/components/marketing/local-services"

// Local technology homepage; client proof stays hidden until approved content exists.
export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "ZeroPoint",
          url: SITE_URL,
          email: BUSINESS_INFO.email || undefined,
          telephone: BUSINESS_INFO.telephone || undefined,
          areaServed: BUSINESS_INFO.areaServed,
          description: "Local Wi-Fi, UniFi networking, and on-demand technology help for homes and small businesses.",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Local technology services",
            itemListElement: ["Home Wi-Fi", "UniFi installation", "Computer and tech support", "Business networking", "Network Care", "Websites"].map((name) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name, areaServed: BUSINESS_INFO.areaServed },
            })),
          },
          address: { "@type": "PostalAddress", addressLocality: "Boca Raton", addressRegion: "FL", addressCountry: "US" },
        }}
      />
      <TopNav />
      <main>
        <Hero />
        <ServicePicker />
        <CommonProblems />
        <NetworkingSpecialty />
        <TechSupportSection />
        <StartingPricing preview />
        <NetworkCare />
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
