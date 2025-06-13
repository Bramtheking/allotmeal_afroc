"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-yellow-950/30 dark:via-gray-950 dark:to-blue-950/30" />
      <div className="absolute top-20 right-0 w-72 h-72 bg-yellow-400/20 dark:bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight">
                <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
                  Allotmeal Afroc Ltd
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Home of Africa&apos;s choice of heritage and opportunities
              </p>
            </motion.div>
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Connecting hotels, businesses, and stakeholders across Africa through innovative networking solutions and
              premium services.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 group"
                asChild
              >
                <Link href="/#services">
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/#contact">Contact Us</Link>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className="relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-blue-600 opacity-90 flex items-center justify-center">
              <div className="text-white text-center p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Connecting Africa</h2>
                <p className="text-lg mb-8">Through hospitality, agriculture, transport, and more</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">Hotel Networking</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">Transport</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">Agriculture</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">Education</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">Health</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
