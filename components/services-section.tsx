"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { collection, getDocs, query, limit, where } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
import { MapPin, Star, ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { getVideoThumbnail, getYouTubeThumbnail } from "@/lib/cloudinary"

const serviceCategories = [
  {
    id: "agriculture",
    title: "Agriculture",
    description: "Farming, livestock, and agricultural services",
    icon: "🌾",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    id: "construction",
    title: "Construction",
    description: "Building, renovation, and construction services",
    icon: "🏗️",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  },
  {
    id: "education",
    title: "Education",
    description: "Schools, training, and educational services",
    icon: "📚",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    id: "entertainment",
    title: "Entertainment",
    description: "Events, shows, and entertainment services",
    icon: "🎭",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    id: "health",
    title: "Health",
    description: "Medical, wellness, and health services",
    icon: "🏥",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  {
    id: "hotel-industry",
    title: "Hotel & Industry",
    description: "Hospitality and industrial services",
    icon: "🏨",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  },
  {
    id: "jobs",
    title: "Jobs",
    description: "Employment and career opportunities",
    icon: "💼",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  },
  {
    id: "sermon",
    title: "Sermon",
    description: "Religious services and spiritual guidance",
    icon: "⛪",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  {
    id: "sme-products",
    title: "SME Products",
    description: "Small and medium enterprise products",
    icon: "📦",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  },
  {
    id: "tenders",
    title: "Tenders",
    description: "Government and private tenders",
    icon: "📋",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  },
  {
    id: "transport",
    title: "Transport",
    description: "Transportation and logistics services",
    icon: "🚛",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  },
]

export default function ServicesSection() {
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

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-blue-950/30 dark:via-gray-950 dark:to-yellow-950/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover a wide range of services across various industries. From agriculture to technology, we connect you
            with the best service providers.
          </p>
        </div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {serviceCategories.map((category) => (
            <Link key={category.id} href={`/services/${category.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{category.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
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
          ) : featuredServices.length > 0 ? (
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
                        <Badge className={serviceCategories.find((cat) => cat.id === service.serviceType)?.color}>
                          {serviceCategories.find((cat) => cat.id === service.serviceType)?.title ||
                            service.serviceType}
                        </Badge>
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
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured services available at the moment.</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of satisfied customers who have found the perfect services through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/services">Browse All Services</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard/marketing/services/create">List Your Service</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
