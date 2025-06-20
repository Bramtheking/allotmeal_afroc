"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Building2,
  Package,
  Music,
  Briefcase,
  Wheat,
  FileText,
  GraduationCap,
  Heart,
  Truck,
  HardHat,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"

const services = [
  {
    title: "Hotel Industry",
    description: "Discover premium accommodations, resorts, and hospitality services",
    icon: Building2,
    href: "/services/hotel-industry",
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    title: "SME Products",
    description: "Quality products from small and medium enterprises",
    icon: Package,
    href: "/services/sme-products",
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Entertainment",
    description: "Events, shows, and entertainment experiences",
    icon: Music,
    href: "/services/entertainment",
    color: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "Jobs",
    description: "Find career opportunities and employment services",
    icon: Briefcase,
    href: "/services/jobs",
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Agriculture",
    description: "Agricultural products, livestock, and farming services",
    icon: Wheat,
    href: "/services/agriculture",
    color: "from-amber-400 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Tenders",
    description: "Government and private sector tender opportunities",
    icon: FileText,
    href: "/services/tenders",
    color: "from-indigo-400 to-blue-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "Education",
    description: "Educational institutions and learning opportunities",
    icon: GraduationCap,
    href: "/services/education",
    color: "from-teal-400 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  {
    title: "Health",
    description: "Healthcare services, clinics, and medical programs",
    icon: Heart,
    href: "/services/health",
    color: "from-red-400 to-pink-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    title: "Transport",
    description: "Transportation services and logistics solutions",
    icon: Truck,
    href: "/services/transport",
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    title: "Construction",
    description: "Construction services, materials, and project management",
    icon: HardHat,
    href: "/services/construction",
    color: "from-gray-400 to-slate-500",
    bgColor: "bg-gray-50 dark:bg-gray-950/20",
    iconColor: "text-gray-600 dark:text-gray-400",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const cardHoverVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
}

export default function ServicesSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-yellow-50/50 via-white to-blue-50/50 dark:from-yellow-950/10 dark:via-gray-950 dark:to-blue-950/10 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-100/10 to-blue-100/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-blue-100 dark:from-yellow-950/50 dark:to-blue-950/50 px-4 py-2 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Our Services</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-yellow-700 to-blue-900 dark:from-white dark:via-yellow-400 dark:to-blue-400 bg-clip-text text-transparent">
            Explore Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover a comprehensive range of services designed to meet your needs. From hospitality to healthcare, we
            connect you with quality providers across various industries.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div key={service.title} variants={itemVariants} whileHover="hover">
                <Link href={service.href} className="block h-full">
                  <motion.div variants={cardHoverVariants}>
                    <Card
                      className={`h-full transition-all duration-300 border-0 shadow-lg hover:shadow-2xl ${service.bgColor} backdrop-blur-sm group relative overflow-hidden`}
                    >
                      {/* Gradient overlay on hover */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      />

                      <CardContent className="p-6 relative">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <motion.div
                            className={`p-4 rounded-2xl ${service.bgColor} border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className={`h-8 w-8 ${service.iconColor}`} />
                          </motion.div>

                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                              {service.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                          </div>

                          <motion.div
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors pt-2"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                          >
                            <span>Explore</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="text-muted-foreground mb-6">Can't find what you're looking for?</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <Link href="#/contact">
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

// Provide a named export in addition to the default export
export { ServicesSection }
