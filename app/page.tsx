import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { FeaturedAdvertisements } from "@/components/featured-advertisements"
import { AboutSection } from "@/components/about-section"
import { StatsSection } from "@/components/stats-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PartnersSection } from "@/components/partners-section"
import { ContactSection } from "@/components/contact-section"

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <FeaturedAdvertisements />
      <AboutSection />
      <StatsSection />
      <TestimonialsSection />
      <PartnersSection />
      <ContactSection />
    </main>
  )
}
