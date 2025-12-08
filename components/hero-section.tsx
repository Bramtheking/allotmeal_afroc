"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"

export function HeroSection() {

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-white to-blue-100 dark:from-yellow-950/40 dark:via-gray-950 dark:to-blue-950/40" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-yellow-400/30 dark:bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-300/20 dark:bg-yellow-400/10 rounded-full blur-2xl animate-bounce" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <motion.div
                className="flex flex-col items-center gap-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-xl bg-white/90 backdrop-blur-sm">
                  <Image
                    src="/logo.png"
                    alt="Allotmeal Afroc Ltd Logo"
                    fill
                    className="object-cover rounded-full scale-85"
                    priority
                  />
                </div>
              </motion.div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight text-center">
                <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
                  Allotmeal Afroc Ltd
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground text-center">
                Home of Africa&apos;s choice of heritage and opportunities
              </p>
            </motion.div>
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
               Connecting promoting and advertising hotels, businesses and stakeholders across Africa through innovative networking solutions and
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
            className="relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-200 dark:border-yellow-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-blue-600 opacity-95 flex items-center justify-center">
              <div className="text-white text-center p-8">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-6"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  Connecting Africa
                </motion.h2>
                <p className="text-lg mb-8">Through hospitality, agriculture, transport, and more</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <motion.span
                    className="px-4 py-2 bg-white/30 rounded-full text-sm backdrop-blur-sm border border-white/20"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Hotel Networking
                  </motion.span>
                  <motion.span
                    className="px-4 py-2 bg-white/30 rounded-full text-sm backdrop-blur-sm border border-white/20"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Transport
                  </motion.span>
                  <motion.span
                    className="px-4 py-2 bg-white/30 rounded-full text-sm backdrop-blur-sm border border-white/20"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Agriculture
                  </motion.span>
                  <motion.span
                    className="px-4 py-2 bg-white/30 rounded-full text-sm backdrop-blur-sm border border-white/20"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Education
                  </motion.span>
                  <motion.span
                    className="px-4 py-2 bg-white/30 rounded-full text-sm backdrop-blur-sm border border-white/20"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Health
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
