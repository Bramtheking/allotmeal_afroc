"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Briefcase,
  Hammer,
  Wheat,
  Music,
  Package,
  FileText,
  GraduationCap,
  Heart,
  Truck,
  Church,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { ServiceOptionsDialog } from "./service-options-dialog"

const serviceIcons = {
  "hotel-industry": Building2,
  jobs: Briefcase,
  construction: Hammer,
  agriculture: Wheat,
  entertainment: Music,
  "sme-products": Package,
  tenders: FileText,
  education: GraduationCap,
  health: Heart,
  transport: Truck,
  sermon: Church,
}

const serviceColors = {
  "hotel-industry": "from-amber-500 to-orange-500",
  jobs: "from-emerald-500 to-teal-500",
  construction: "from-orange-500 to-red-500",
  agriculture: "from-green-500 to-lime-500",
  entertainment: "from-purple-500 to-pink-500",
  "sme-products": "from-indigo-500 to-purple-500",
  tenders: "from-slate-600 to-gray-700",
  education: "from-cyan-500 to-teal-500",
  health: "from-rose-500 to-pink-500",
  transport: "from-yellow-500 to-orange-500",
  sermon: "from-violet-500 to-purple-600",
}

const serviceBgColors = {
  "hotel-industry": "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
  jobs: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
  construction: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
  agriculture: "bg-gradient-to-br from-green-50 to-lime-50 dark:from-green-950/20 dark:to-lime-950/20",
  entertainment: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
  "sme-products": "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20",
  tenders: "bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20",
  education: "bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/20 dark:to-teal-950/20",
  health: "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20",
  transport: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20",
  sermon: "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
}

interface ServiceCategory {
  id: string
  name: string
  count: number
}

export function ServicesSection() {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<string | null>(null)

  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        const db = getFirebaseDb()
        if (!db) return

        const servicesRef = collection(db, "services")
        const snapshot = await getDocs(servicesRef)

        // Group services by category and count them
        const categoryCount: { [key: string]: number } = {}

        snapshot.docs.forEach((doc) => {
          const data = doc.data()
          const serviceType = data.serviceType || data.category
          if (serviceType) {
            categoryCount[serviceType] = (categoryCount[serviceType] || 0) + 1
          }
        })

        // Convert to array format
        const categories = Object.entries(categoryCount).map(([id, count]) => ({
          id,
          name: formatCategoryName(id),
          count,
        }))

        setServiceCategories(categories)
      } catch (error) {
        console.error("Error fetching service categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServiceCategories()
  }, [])

  const formatCategoryName = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      const navbarHeight = 80
      const elementPosition = contactSection.offsetTop - navbarHeight

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    } else {
      const contactElement =
        document.querySelector('[id="contact"]') ||
        document.querySelector(".contact-section") ||
        document.querySelector("section:last-child")

      if (contactElement) {
        contactElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  }

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-950 dark:via-gray-900 dark:to-amber-950/10">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading services...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-950 dark:via-gray-900 dark:to-amber-950/10">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Our Services</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-amber-700 to-orange-600 dark:from-white dark:via-amber-300 dark:to-orange-400 bg-clip-text text-transparent">
            Comprehensive Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our extensive range of services across multiple industries and sectors.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {serviceCategories.map((category) => {
            const IconComponent = serviceIcons[category.id as keyof typeof serviceIcons] || Package
            const color = serviceColors[category.id as keyof typeof serviceColors] || "from-gray-500 to-gray-600"
            const bgColor =
              serviceBgColors[category.id as keyof typeof serviceBgColors] || "bg-gray-50 dark:bg-gray-950/20"

            return (
              <Card
                key={category.id}
                className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 ${bgColor} backdrop-blur-sm relative overflow-hidden`}
                onClick={() => setSelectedService(category.id)}
              >
                <CardHeader className="pb-4 relative">
                  <div className="relative mb-6">
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden mb-4 shadow-lg">
                      <img
                        src={`/services/${category.id}.jpg`}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `/placeholder.svg?height=240&width=320&text=${encodeURIComponent(category.name)}`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center text-white shadow-xl absolute -bottom-2 right-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="h-7 w-7" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <CardTitle className="text-xl font-bold group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                      {category.name}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      {category.count} Services
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-orange-500 group-hover:text-white transition-all duration-300 font-medium"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-red-400/20 rounded-3xl blur-3xl" />
          <div className="relative bg-gradient-to-br from-white via-amber-50/50 to-orange-50/50 dark:from-gray-900 dark:via-amber-950/20 dark:to-orange-950/20 rounded-3xl p-12 border border-amber-200/50 dark:border-amber-800/30 shadow-2xl backdrop-blur-sm">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full mb-8 shadow-lg">
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold">Need Something Specific?</span>
              </div>

              <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-amber-700 to-orange-600 dark:from-white dark:via-amber-300 dark:to-orange-400 bg-clip-text text-transparent">
                Can't Find What You're Looking For?
              </h3>

              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                Our expert team is ready to provide personalized solutions tailored to your unique requirements.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  size="lg"
                  onClick={scrollToContact}
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <MessageCircle className="mr-3 h-6 w-6" />
                  Contact Us
                </Button>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Available 24/7</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span>Expert Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Options Dialog */}
      <ServiceOptionsDialog
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        serviceType={selectedService || ""}
      />
    </section>
  )
}
