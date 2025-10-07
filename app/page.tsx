"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { FeaturedAdvertisements } from "@/components/featured-advertisements"
import { AboutSection } from "@/components/about-section"
import { StatsSection } from "@/components/stats-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PartnersSection } from "@/components/partners-section"
import { ContactSection } from "@/components/contact-section"
import VisitorTracker from "@/components/visitor-tracker"

export default function HomePage() {
  const [heroReady, setHeroReady] = useState(false)

  return (
    <main className="scroll-smooth">
      <VisitorTracker page="/" />
      <section id="home">
        <HeroSection onHeroReady={() => setHeroReady(true)} />
      </section>
      {heroReady && (
        <>
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
        </>
      )}
    </main>
  )
}
