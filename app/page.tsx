"use client"

import { HeroSection } from "@/components/hero-section"
import { FeaturedVideoSection } from "@/components/featured-video-section"
import { ServicesSection } from "@/components/services-section"
import { FeaturedAdvertisements } from "@/components/featured-advertisements"
import { PlacementAdvertisements } from "@/components/placement-advertisements"
import { AboutSection } from "@/components/about-section"
import { StatsSection } from "@/components/stats-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PartnersSection } from "@/components/partners-section"
import { ContactSection } from "@/components/contact-section"
import VisitorTracker from "@/components/visitor-tracker"

export default function HomePage() {
  return (
    <main className="scroll-smooth">
      <VisitorTracker page="/" />
      <section id="home">
        <HeroSection />
      </section>
      <FeaturedVideoSection />
      {/* Ads below featured video, above services */}
      <PlacementAdvertisements placement="below-video" maxAds={3} />
      <section id="services">
        <ServicesSection />
      </section>
      <FeaturedAdvertisements />
      <section id="about">
        <AboutSection />
      </section>
      <StatsSection />
      <TestimonialsSection />
      <PartnersSection />
      <section id="contact">
        <ContactSection />
      </section>
    </main>
  )
}
