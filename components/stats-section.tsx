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
    <section className="py-12 bg-gradient-to-r from-yellow-100 via-yellow-50 to-blue-100 dark:from-yellow-950/40 dark:via-yellow-900/20 dark:to-blue-950/40 relative overflow-hidden">
      {/* Add floating elements */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl animate-float" />
      <div
        className="absolute bottom-0 right-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="container relative z-10">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-yellow-200/50 dark:border-yellow-800/50 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-muted-foreground mt-2 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
