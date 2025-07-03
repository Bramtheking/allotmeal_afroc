"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, Globe, Award } from "lucide-react"

const features = [
  {
    icon: Building2,
    title: "Hotel Networking",
    description: "Connecting hotels and hospitality businesses across Africa for enhanced collaboration and growth.",
  },
  {
    icon: Users,
    title: "Stakeholder Engagement",
    description: "Building bridges between businesses, communities, and organizations for mutual benefit.",
  },
  {
    icon: Globe,
    title: "Pan-African Reach",
    description: "Expanding opportunities and connections across the African continent and beyond.",
  },
  {
    icon: Award,
    title: "Excellence in Service",
    description: "Committed to delivering premium services and maintaining the highest standards.",
  },
]

export function AboutSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-yellow-500 to-blue-600 bg-clip-text text-transparent">
                Allotmeal Afroc Ltd
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              We are a dynamic company dedicated to fostering connections and opportunities across Africa. Our mission
              is to bridge the gap between businesses, communities, and stakeholders through innovative networking
              solutions and premium services.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              From hospitality and agriculture to transport and education, we serve as the catalyst for growth and
              collaboration in diverse sectors across the continent.
            </p>

            {/* Company Logo in About Section */}
            <motion.div
              className="flex justify-center lg:justify-start mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-48 h-48 rounded-full overflow-hidden bg-white shadow-xl border-4 border-yellow-200 dark:border-yellow-800 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Allotmeal Afroc Ltd Logo"
                  className="w-full h-full object-contain p-4"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <feature.icon className="h-12 w-12 text-yellow-500 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
