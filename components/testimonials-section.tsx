"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "Allotmeal Afroc has transformed how we connect with hotels across Africa. Their networking platform has opened new opportunities for our business.",
    author: "Sarah Johnson",
    position: "CEO, Safari Tours Ltd",
  },
  {
    quote:
      "The agricultural product connectivity service has helped our farm reach more hotels and restaurants than ever before. Truly revolutionary!",
    author: "Michael Ochieng",
    position: "Owner, Green Farms Kenya",
  },
  {
    quote:
      "As a small business owner, the SME product platform has given me visibility I couldn't achieve on my own. My sales have increased by 40%.",
    author: "Amina Hassan",
    position: "Founder, Amina Crafts",
  },
]

export function TestimonialsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="py-20 bg-gradient-to-r from-yellow-50 to-blue-50 dark:from-yellow-950/30 dark:to-blue-950/30">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from businesses and individuals who have benefited from our services across Africa.
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card className="h-full bg-background/80 backdrop-blur-sm border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900">
                <CardContent className="p-8">
                  <Quote className="h-10 w-10 text-yellow-500 mb-4 opacity-50" />
                  <p className="text-lg mb-6">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-muted-foreground">{testimonial.position}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
