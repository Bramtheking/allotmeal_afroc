"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Users, Globe, Award } from "lucide-react"

const features = [
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    description: "We ensure all services meet the highest standards of quality and reliability.",
  },
  {
    icon: Users,
    title: "Community Focused",
    description: "Building stronger communities through accessible services and opportunities.",
  },
  {
    icon: Globe,
    title: "Wide Reach",
    description: "Connecting people across different regions and industries.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to delivering exceptional value in everything we do.",
  },
]

export function AboutSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              About AllotMeAfroc
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              AllotMeAfroc is your comprehensive platform for discovering and accessing essential services across
              multiple industries. We bridge the gap between service providers and consumers, creating opportunities for
              growth and connection.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              From agriculture and construction to education and entertainment, we provide a centralized hub where
              quality meets accessibility. Our mission is to empower communities by making vital services easily
              discoverable and accessible to everyone.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3"
                >
                  <feature.icon className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center overflow-hidden">
                    <img
                      src="/logo.png"
                      alt="Allotmeal Afroc Logo"
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                      style={{ maxWidth: "192px", maxHeight: "192px" }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const fallback = document.createElement("div")
                        fallback.className =
                          "w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto"
                        fallback.innerHTML = '<span class="text-white font-bold text-4xl">A</span>'
                        target.parentNode?.appendChild(fallback)
                      }}
                    />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    To become the leading platform that transforms how people discover, access, and engage with
                    essential services, fostering economic growth and community development across Africa and beyond.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
