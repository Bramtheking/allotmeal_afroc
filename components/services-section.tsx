"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { collection, getDocs, query, limit, where } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
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
  MapPin,
  Play,
} from "lucide-react"
import Link from "next/link"
import { getVideoThumbnail, getYouTubeThumbnail } from "@/lib/cloudinary"
import { ServiceOptionsDialog } from "./service-options-dialog"

const services = [
  {
    id: "hotel-industry",
    title: "Hotel & Industry",
    description: "Luxury accommodations, resorts, and hospitality services for your perfect stay.",
    icon: Building2,
    image: "/services/hotel.jpg",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
    count: "150+ Hotels",
    featured: true,
  },
  {
    id: "jobs",
    title: "Jobs",
    description: "Find your dream career with our extensive job listings and opportunities.",
    icon: Briefcase,
    image: "/services/jobs.jpg",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
    count: "500+ Positions",
    featured: true,
  },
  {
    id: "construction",
    title: "Construction",
    description: "Professional construction services, materials, and project management solutions.",
    icon: Hammer,
    image: "/services/construction.jpg",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
    count: "200+ Projects",
    featured: false,
  },
  {
    id: "agriculture",
    title: "Agriculture",
    description: "Modern farming solutions, livestock, and agricultural products for sustainable growth.",
    icon: Wheat,
    image: "/services/agriculture.jpg",
    color: "from-green-500 to-lime-500",
    bgColor: "bg-gradient-to-br from-green-50 to-lime-50 dark:from-green-950/20 dark:to-lime-950/20",
    count: "300+ Farms",
    featured: false,
  },
  {
    id: "entertainment",
    title: "Entertainment",
    description: "Events, shows, and entertainment services to make your occasions memorable.",
    icon: Music,
    image: "/services/entertainment.jpg",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
    count: "100+ Events",
    featured: true,
  },
  {
    id: "sme-products",
    title: "SME Products",
    description: "Small and medium enterprise products, services, and business solutions.",
    icon: Package,
    image: "/services/sme-products.jpg",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20",
    count: "400+ Products",
    featured: false,
  },
  {
    id: "tenders",
    title: "Tenders",
    description: "Government and private sector tender opportunities and procurement services.",
    icon: FileText,
    image: "/services/tenders.jpg",
    color: "from-slate-600 to-gray-700",
    bgColor: "bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20",
    count: "50+ Tenders",
    featured: false,
  },
  {
    id: "education",
    title: "Education",
    description: "Educational institutions, courses, and learning opportunities for all ages.",
    icon: GraduationCap,
    image: "/services/education.jpg",
    color: "from-cyan-500 to-teal-500",
    bgColor: "bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/20 dark:to-teal-950/20",
    count: "80+ Schools",
    featured: false,
  },
  {
    id: "health",
    title: "Health",
    description: "Healthcare services, medical facilities, and wellness programs for better living.",
    icon: Heart,
    image: "/services/health.jpg",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20",
    count: "60+ Clinics",
    featured: false,
  },
  {
    id: "transport",
    title: "Transport",
    description: "Transportation services, logistics, and mobility solutions for all your needs.",
    icon: Truck,
    image: "/services/transport.jpg",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20",
    count: "120+ Vehicles",
    featured: false,
  },
  {
    id: "sermon",
    title: "Sermon",
    description: "Spiritual content, sermons, and religious services for your faith journey.",
    icon: Church,
    image: "/services/sermon.jpg",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
    count: "200+ Sermons",
    featured: false,
  },
]

export function ServicesSection() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [featuredServices, setFeaturedServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedServices()
  }, [])

  const fetchFeaturedServices = async () => {
    try {
      const db = await getFirebaseDb()
      if (!db) return

      // Fetch active services, limited to 6 for featured section
      const servicesQuery = query(collection(db, "services"), where("status", "==", "active"), limit(6))

      const snapshot = await getDocs(servicesQuery)
      const fetchedServices = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[]

      setFeaturedServices(fetchedServices)
    } catch (error) {
      console.error("Error fetching featured services:", error)
    } finally {
      setLoading(false)
    }
  }

  const getServiceThumbnail = (service: Service) => {
    // Priority: images → video thumbnails → YouTube thumbnails → placeholder
    if (service.images && service.images.length > 0) {
      return service.images[0]
    }

    if (service.videos && service.videos.length > 0) {
      const thumbnail = getVideoThumbnail(service.videos[0])
      if (thumbnail) return thumbnail
    }

    if (service.youtubeLinks && service.youtubeLinks.length > 0) {
      const thumbnail = getYouTubeThumbnail(service.youtubeLinks[0])
      if (thumbnail) return thumbnail
    }

    return "/placeholder.svg?height=200&width=300"
  }

  const hasVideoContent = (service: Service) => {
    return (service.videos && service.videos.length > 0) || (service.youtubeLinks && service.youtubeLinks.length > 0)
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
          {services.map((service) => {
            const IconComponent = service.icon

            return (
              <Card
                key={service.id}
                className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 ${service.bgColor} backdrop-blur-sm relative overflow-hidden`}
                onClick={() => setSelectedService(service.id)}
              >
                {service.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      <Star className="h-3 w-3 fill-current" />
                      POPULAR
                    </div>
                  </div>
                )}

                <CardHeader className="pb-4 relative">
                  <div className="relative mb-6">
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden mb-4 shadow-lg">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `/placeholder.svg?height=240&width=320&text=${encodeURIComponent(service.title)}`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center text-white shadow-xl absolute -bottom-2 right-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="h-7 w-7" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <CardTitle className="text-xl font-bold group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      {service.count}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed mb-6 text-gray-600 dark:text-gray-400">
                    {service.description}
                  </CardDescription>
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

        {/* Featured Services from Database */}
        {featuredServices.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Featured Services</h3>
              <p className="text-muted-foreground">Real services from our community</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 bg-muted animate-pulse" />
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-3 bg-muted rounded animate-pulse mb-4 w-2/3" />
                      <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredServices.map((service) => (
                  <Link key={service.id} href={`/services/${service.serviceType}/${service.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={getServiceThumbnail(service) || "/placeholder.svg"}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                        {hasVideoContent(service) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="bg-white/90 rounded-full p-3">
                              <Play className="h-6 w-6 text-gray-800" />
                            </div>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-primary text-primary-foreground">{service.serviceType}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                          {service.title}
                        </h4>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{service.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-muted-foreground">
                            {service.location && (
                              <>
                                <MapPin className="h-3 w-3 mr-1" />
                                <span className="truncate">{service.location}</span>
                              </>
                            )}
                          </div>
                          {service.rating && (
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span className="font-medium">{service.rating}</span>
                            </div>
                          )}
                        </div>
                        {service.price && (
                          <div className="mt-3 pt-3 border-t">
                            <span className="font-semibold text-primary">{service.price}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

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
