"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Calendar, Trophy, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function WorldCouplesDayBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date("2026-08-15T00:00:00").getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-red-50 to-purple-50 dark:from-pink-950/30 dark:via-red-950/30 dark:to-purple-950/30 overflow-hidden relative">
      {/* Animated hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300 dark:text-pink-700 opacity-20"
            initial={{ y: "100%", x: `${Math.random() * 100}%` }}
            animate={{
              y: "-100%",
              x: `${Math.random() * 100}%`,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          >
            <Heart className="h-8 w-8" fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-pink-500 via-red-500 to-purple-600">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              {/* Left side - Content */}
              <div className="text-white space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Trophy className="h-5 w-5 text-yellow-300" />
                  <span className="font-semibold">Global Competition</span>
                </div>

                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-3">
                    World Couple's Day
                  </h2>
                  <p className="text-xl text-pink-100 mb-2">August 15, 2026</p>
                  <p className="text-lg text-white/90">
                    Win a FREE luxury holiday for you and your loved one!
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <span className="text-lg">10 Winning Couples</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Heart className="h-5 w-5" />
                    </div>
                    <span className="text-lg">Free Hotel Holidays Worldwide</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <span className="text-lg">Entry Fee: KSh 500 / USD 10</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-pink-600 hover:bg-pink-50 shadow-xl text-lg h-14"
                  >
                    <Link href="/world-couples-day">
                      Enter Competition
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 text-lg h-14"
                  >
                    <Link href="/world-couples-day#details">Learn More</Link>
                  </Button>
                </div>
              </div>

              {/* Right side - Countdown */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white/90 text-xl mb-6 font-semibold">
                    Competition Starts In:
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: "Days", value: timeLeft.days },
                      { label: "Hours", value: timeLeft.hours },
                      { label: "Minutes", value: timeLeft.minutes },
                      { label: "Seconds", value: timeLeft.seconds },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-w-[80px]"
                      >
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                          {String(item.value).padStart(2, "0")}
                        </div>
                        <div className="text-sm text-pink-100 font-medium">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                    <p className="text-white font-semibold text-lg mb-2">
                      🎉 Be Among the First 1000 Entries!
                    </p>
                    <p className="text-pink-100 text-sm">
                      Early bird entries get featured on our social media
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
