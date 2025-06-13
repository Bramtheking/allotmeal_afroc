"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const stats = [
  { value: "10+", label: "Service Categories" },
  { value: "100+", label: "Business Partners" },
  { value: "1000+", label: "Happy Customers" },
  { value: "5+", label: "African Countries" },
]

export function StatsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-12 bg-gradient-to-r from-yellow-50 to-blue-50 dark:from-yellow-950/30 dark:to-blue-950/30">
      <div className="container">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 to-blue-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-muted-foreground mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
