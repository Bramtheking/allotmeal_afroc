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
      <div id="home">
        <HeroSection />
      </div>
      <div id="services">
        <ServicesSection />
      </div>
      <FeaturedAdvertisements />
      <div id="about">
        <AboutSection />
      </div>
      <StatsSection />
      <TestimonialsSection />
      <PartnersSection />
      <div id="contact">
        <ContactSection />
      </div>
    </main>
  )
}
