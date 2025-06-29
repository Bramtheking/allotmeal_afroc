"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { collection, getDocs, query, where } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, ExternalLink, MessageCircle, Phone, Calendar, User, Eye } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Service {
  id: string
  title: string
  description: string
  videos?: string[]
  youtubeLinks?: string[]
  preacher?: string
  sermonDate?: string
  topic?: string
  views?: number
  company?: string
  contact?: string
  email?: string
  createdAt?: any
}

const serviceTitles = {
  "hotel-industry": "Hotel & Industry",
  jobs: "Jobs",
  construction: "Construction",
  agriculture: "Agriculture",
  entertainment: "Entertainment",
  "sme-products": "SME Products",
  tenders: "Tenders",
  education: "Education",
  health: "Health",
  transport: "Transport",
  sermon: "Sermon",
}

export default function ServiceVideosPage() {
  const params = useParams()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const serviceType = params.serviceType as string
  const serviceTitle = serviceTitles[serviceType as keyof typeof serviceTitles] || serviceType

  useEffect(() => {
    const fetchServicesWithVideos = async () => {
      try {
        const db = getFirebaseDb()
        if (!db) {
          console.error("Database not available")
          return
        }

        const servicesRef = collection(db, "services")
        const q = query(servicesRef, where("serviceType", "==", serviceType), where("status", "==", "active"))

        const querySnapshot = await getDocs(q)
        const servicesData: Service[] = []

        querySnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() } as Service
          // Only include services that have videos or YouTube links
          if ((data.videos && data.videos.length > 0) || (data.youtubeLinks && data.youtubeLinks.length > 0)) {
            servicesData.push(data)
          }
        })

        setServices(servicesData)
      } catch (error) {
        console.error("Error fetching services:", error)
        toast.error("Failed to load videos")
      } finally {
        setLoading(false)
      }
    }

    if (serviceType) {
      fetchServicesWithVideos()
    }
  }, [serviceType])

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null
  }

  const handleWhatsAppContact = () => {
    const message = `Hi! I'm interested in ${serviceTitle} services. Can you help me?`
    const whatsappUrl = `https://wa.me/254701524543?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/30 dark:via-gray-950 dark:to-emerald-950/30">
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading videos...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/30 dark:via-gray-950 dark:to-emerald-950/30">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{serviceTitle} Videos</h1>
            <p className="text-muted-foreground">
              Watch videos and media content from our {serviceTitle.toLowerCase()} services
            </p>
          </div>
        </div>

        {services.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Play className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Videos Available</h3>
              <p className="text-muted-foreground mb-6">
                There are currently no videos available for {serviceTitle} services.
              </p>
              <Button asChild>
                <Link href={`/services/${serviceType}`}>View All {serviceTitle} Services</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <p className="text-muted-foreground mt-2">{service.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {service.company && (
                          <Badge variant="secondary" className="text-xs">
                            {service.company}
                          </Badge>
                        )}
                        {service.preacher && (
                          <Badge variant="outline" className="text-xs">
                            <User className="h-3 w-3 mr-1" />
                            {service.preacher}
                          </Badge>
                        )}
                        {service.topic && (
                          <Badge variant="outline" className="text-xs">
                            {service.topic}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/services/${serviceType}/${service.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Uploaded Videos */}
                  {service.videos && service.videos.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Videos ({service.videos.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {service.videos.map((video, index) => (
                          <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                            <video
                              src={video}
                              controls
                              className="w-full h-full object-cover"
                              preload="metadata"
                              poster="/placeholder.svg?height=200&width=300"
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* YouTube Videos */}
                  {service.youtubeLinks && service.youtubeLinks.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        YouTube Videos ({service.youtubeLinks.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {service.youtubeLinks.map((link, index) => {
                          const embedUrl = getYouTubeEmbedUrl(link)
                          return (
                            <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                              {embedUrl ? (
                                <iframe
                                  src={embedUrl}
                                  className="w-full h-full"
                                  allowFullScreen
                                  title={`YouTube video ${index + 1}`}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Button variant="outline" asChild>
                                    <a href={link} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Watch on YouTube
                                    </a>
                                  </Button>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Service Info */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t text-sm text-muted-foreground">
                    {service.sermonDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(service.sermonDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {service.views && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{service.views} views</span>
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  {(service.contact || service.email) && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {service.contact && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`tel:${service.contact}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            {service.contact}
                          </a>
                        </Button>
                      )}
                      {service.email && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${service.email}`}>{service.email}</a>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* WhatsApp Contact Section */}
        <Card className="mt-12 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardHeader className="text-center">
            <CardTitle className="text-green-800 dark:text-green-200">Need More Information?</CardTitle>
            <p className="text-muted-foreground">
              Contact us on WhatsApp for personalized assistance with {serviceTitle.toLowerCase()} services
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={handleWhatsAppContact} className="bg-green-600 hover:bg-green-700 text-white" size="lg">
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact on WhatsApp
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
