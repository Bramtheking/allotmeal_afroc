"use client"
import Link from "next/link"
import {
  Hotel,
  ShoppingBag,
  Music,
  Briefcase,
  Wheat,
  FileText,
  GraduationCap,
  Heart,
  Truck,
  Building,
  ArrowRight,
} from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const services = [
  {
    icon: <Hotel className="h-10 w-10 text-yellow-500" />,
    title: "Hotel & Industry",
    description: "Connect with registered hotels and access premium hospitality services across Africa.",
    link: "/services/hotel-industry",
  },
  {
    icon: <ShoppingBag className="h-10 w-10 text-blue-600" />,
    title: "SME Products",
    description: "Discover a wide range of products from small and medium enterprises across various sectors.",
    link: "/services/sme-products",
  },
  {
    icon: <Music className="h-10 w-10 text-yellow-500" />,
    title: "Entertainment",
    description: "Access live streaming, clip entertainment, and exclusive entertainment content.",
    link: "/services/entertainment",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-blue-600" />,
    title: "Jobs",
    description: "Find casual and permanent job opportunities across various industries and sectors.",
    link: "/services/jobs",
  },
  {
    icon: <Wheat className="h-10 w-10 text-yellow-500" />,
    title: "Agriculture",
    description: "Connect with agricultural products, livestock, and farming structures for sustainable growth.",
    link: "/services/agriculture",
  },
  {
    icon: <FileText className="h-10 w-10 text-blue-600" />,
    title: "Tenders",
    description: "Access private and public tender opportunities for business growth and expansion.",
    link: "/services/tenders",
  },
  {
    icon: <GraduationCap className="h-10 w-10 text-yellow-500" />,
    title: "Education",
    description: "Connect with schools, colleges, and universities for educational programs and enrollment.",
    link: "/services/education",
  },
  {
    icon: <Heart className="h-10 w-10 text-blue-600" />,
    title: "Health",
    description: "Access medical campaigns, clinics, programs, and health seminars across Africa.",
    link: "/services/health",
  },
  {
    icon: <Truck className="h-10 w-10 text-yellow-500" />,
    title: "Transport",
    description: "Find road, air, and ocean transport services with comprehensive scheduling information.",
    link: "/services/transport",
  },
  {
    icon: <Building className="h-10 w-10 text-blue-600" />,
    title: "Construction",
    description: "Access construction sites, materials, equipment, and professional services.",
    link: "/services/construction",
  },
]

export function ServicesSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Allotmeal Afroc Ltd provides end-to-end services and products ranging from hotel, infrastructure, health,
            jobs, and accessibility of agricultural products.
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: Math.min(index * 0.1, 1), duration: 0.5 }}
            >
              <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900">
                <CardHeader>
                  <div className="mb-4 p-3 rounded-lg inline-block bg-gradient-to-br from-yellow-100 to-blue-100 dark:from-yellow-900/30 dark:to-blue-900/30">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full group" variant="outline" asChild>
                    <Link href={service.link}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
