"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { collection, getDocs, limit, query, orderBy } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
import {
  Tractor,
  HardHat,
  GraduationCap,
  Music,
  Heart,
  Building,
  Briefcase,
  Church,
  Package,
  FileText,
  Car,
  ArrowRight,
  Play,
} from "lucide-react"
import Link from "next/link"
import { getVideoThumbnail, getYouTubeThumbnail } from "@/lib/cloudinary"

const serviceIcons = {
  agriculture: Tractor,
  construction: HardHat,
  education: GraduationCap,
  entertainment: Music,
  health: Heart,
  "hotel-industry": Building,
  jobs: Briefcase,
  sermon: Church,
  "sme-products": Package,
  tenders: FileText,
  transport: Car,
}

const serviceCategories = [
  { id: "agriculture", name: "Agriculture", icon: Tractor, color: "bg-green-500" },
  { id: "construction", name: "Construction", icon: HardHat, color: "bg-orange-500" },
  { id: "education", name: "Education", icon: GraduationCap, color: "bg-blue-500" },
  { id: "entertainment", name: "Entertainment", icon: Music, color: "bg-purple-500" },
  { id: "health", name: "Health", icon: Heart, color: "bg-red-500" },
  { id: "hotel-industry", name: "Hotel & Industry", icon: Building, color: "bg-gray-500" },
  { id: "jobs", name: "Jobs", icon: Briefcase, color: "bg-indigo-500" },
  { id: "sermon", name: "Sermon", icon: Church, color: "bg-yellow-500" },
  { id: "sme-products", name: "SME Products", icon: Package, color: "bg-pink-500" },
  { id: "tenders", name: "Tenders", icon: FileText, color: "bg-cyan-500" },
  { id: "transport", name: "Transport", icon: Car, color: "bg-emerald-500" },
]

export default function ServicesSection() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) return

        const servicesQuery = query(collection(db, "services"), orderBy("createdAt", "desc"), limit(6))

        const snapshot = await getDocs(servicesQuery)
        const services = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[]

        setFeaturedServices(services)
      } catch (error) {
        console.error("Error fetching featured services:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedServices()
  }, [])

  const getServiceThumbnail = (service: Service) => {
    // Priority: images > video thumbnails > youtube thumbnails > placeholder
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

    return "/placeholder.svg?height=300&width=400"
  }

  const hasVideoContent = (service: Service) => {
    return (service.videos && service.videos.length > 0) || (service.youtubeLinks && service.youtubeLinks.length > 0)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-blue-950/30 dark:via-gray-950 dark:to-yellow-950/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover a wide range of services across multiple industries, connecting you with trusted providers
          </p>
        </div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {serviceCategories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.id} href={`/services/${category.id}`} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div
                      className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Featured Services */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Featured Services</h3>
            <Button variant="outline" asChild>
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => {
                const Icon = serviceIcons[service.serviceType as keyof typeof serviceIcons] || Package
                return (
                  <Link key={service.id} href={`/services/${service.serviceType}/${service.id}`}>
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={getServiceThumbnail(service) || "/placeholder.svg"}
                          alt={service.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {hasVideoContent(service) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                              <Play className="h-6 w-6 text-gray-800 ml-1" />
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-white/90">
                            <Icon className="h-3 w-3 mr-1" />
                            {service.serviceType?.replace("-", " ")}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <CardTitle className="text-lg mb-2 line-clamp-1">{service.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mb-3">{service.description}</CardDescription>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{service.company}</span>
                          {service.price && <span className="font-semibold">{service.price}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
