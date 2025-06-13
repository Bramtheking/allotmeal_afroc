import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { PartnersSection } from "@/components/partners-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { StatsSection } from "@/components/stats-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <PartnersSection />
      <ContactSection />
    </>
  )
}
