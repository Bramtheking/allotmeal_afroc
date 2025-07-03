"use client"

import { CheckCircle } from 'lucide-react'
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const features = [
  {
    text: "Establish a premier networking ecosystem that connects hotels, hospitality businesses, and key stakeholders.",
    color: "yellow",
  },
  {
    text: "Develop seamless and reliable transportation services to support hotel operations and guest mobility.",
    color: "blue",
  },
  {
    text: "Bridge the gap between farmers, suppliers, and the hotel industry for sustainable food services.",
    color: "yellow",
  },
  {
    text: "Offer industry-specific training, mentorship, and networking platforms for professionals.",
    color: "blue",
  },
  {
    text: "Lead initiatives that promote sustainability, ethical business practices, and community engagement.",
    color: "yellow",
  },
]

export function AboutSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="about" className="py-20">
      <div className="container">
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Allotmeal Afroc Ltd</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Allotmeal Afroc Ltd is a trusted company whose aims are providing end-to-end services and products ranging
              from hotel, infrastructure, health, jobs, and accessibility of agricultural products.
            </p>
            <div className="space-y-5">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <CheckCircle className={`h-6 w-6 text-${feature.color}-500 shrink-0 mt-1`} />
                  <p className="text-base md:text-lg">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-yellow-500 opacity-90 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 mb-4 flex items-center justify-center p-4">
                <div className="w-full h-full rounded-full bg-white shadow-xl border-4 border-white/50 flex items-center justify-center p-4">
                  <img
                    src="/logo.png"
                    alt="Allotmeal Afroc Logo"
                    className="w-full h-full object-contain"
                    onLoad={() => console.log("About section logo loaded")}
                    onError={(e) => {
                      console.log("About section logo failed to load")
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      const parent = target.parentElement
                      if (parent && !parent.querySelector('.about-logo-fallback')) {
                        const fallback = document.createElement("div")
                        fallback.className = "about-logo-fallback w-full h-full bg-gradient-to-br from-yellow-400 to-blue-500 rounded-full flex items-center justify-center"
                        fallback.innerHTML = '<span class="text-white font-bold text-4xl">A</span>'
                        parent.appendChild(fallback)
                      }
                    }}
                  />
                </div>
              </div>
              <div className="text-white text-center p-8 pt-0">
                <h3 className="text-2xl md:text-3xl font-bold mb-6">Our Vision</h3>
                <p className="text-lg mb-8">
                  To be Africa's leading provider of integrated hospitality and networking solutions, connecting
                  businesses and opportunities across the continent.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">Innovation</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">Excellence</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">Integrity</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">Collaboration</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
