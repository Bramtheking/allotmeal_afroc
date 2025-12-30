"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Phone, Mail, Globe, Star, Play, Share2, Briefcase } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import VisitorTracker from "@/components/visitor-tracker"
import { ServicePaymentGate } from "@/components/service-payment-gate"
import { JobApplicationDialog } from "@/components/job-application-dialog"
import { PlacementAdvertisements } from "@/components/placement-advertisements"

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [showJobApplicationDialog, setShowJobApplicationDialog] = useState(false)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db || !params.id) return

        const idOrSlug = params.id as string

        // Try to fetch by ID first
        let docSnap = await getDoc(doc(db, "services", idOrSlug))

        // If not found and looks like a slug, search by slug
        if (!docSnap.exists() && idOrSlug.includes('-')) {
          const { collection, query, where, getDocs } = await import("firebase/firestore")
          const q = query(collection(db, "services"), where("slug", "==", idOrSlug))
          const querySnapshot = await getDocs(q)

          if (!querySnapshot.empty) {
            const firstDoc = querySnapshot.docs[0]
            const serviceData = { id: firstDoc.id, ...firstDoc.data() } as Service
            setService(serviceData)
            setLoading(false)
            return
          }
        }

        if (docSnap.exists()) {
          const serviceData = { id: docSnap.id, ...docSnap.data() } as Service
          setService(serviceData)
        } else {
          toast.error("Service not found")
          router.back()
        }
      } catch (error) {
        console.error("Error fetching service:", error)
        toast.error("Failed to load service details")
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [params.id, router])

  const handleBooking = () => {
    if (service?.contact) {
      window.open(`tel:${service.contact}`, "_blank")
    } else if (service?.email) {
      window.open(`mailto:${service.email}`, "_blank")
    } else {
      // Use default contact information as fallback
      const defaultPhone = "+254 701 524543"
      const defaultEmail = "allotmealafrockenya@gmail.com"

      // Create action selection
      const usePhone = confirm("Contact us via phone or email?\nClick OK for Phone, Cancel for Email")
      if (usePhone) {
        window.open(`tel:${defaultPhone}`, "_blank")
      } else {
        window.open(`mailto:${defaultEmail}?subject=Inquiry about ${service?.title || 'Service'}&body=Hello, I would like to inquire about the ${service?.title || 'service'} listed on your website.`, "_blank")
      }
    }
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service?.title,
          text: service?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard!")
      } catch (error) {
        toast.error("Failed to copy link")
      }
    }
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading service details...</span>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="container py-32">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  // For jobs, don't use ServicePaymentGate - payment happens when applying
  const isJobService = params.serviceType === "jobs"
  console.log("Service type:", params.serviceType, "Is job service:", isJobService)

  const pageContent = (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-yellow-950/30 dark:via-gray-950 dark:to-blue-950/30">
      <VisitorTracker page={`/services/${params.serviceType}/${params.id}`} />
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {service.images && service.images.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video w-full bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={service.images[0] || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {service.images.length > 1 && (
                    <div className="p-4">
                      <div className="grid grid-cols-4 gap-2">
                        {service.images.slice(1, 5).map((image, index) => (
                          <div key={index} className="aspect-square bg-muted rounded overflow-hidden">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`${service.title} ${index + 2}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Videos */}
            {service.videos && service.videos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.videos.map((video, index) => (
                      <div key={index} className="aspect-video bg-muted rounded overflow-hidden">
                        <video src={video} controls className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* YouTube Videos */}
            {service.youtubeLinks && service.youtubeLinks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    YouTube Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.youtubeLinks.map((link, index) => {
                      const embedUrl = getYouTubeEmbedUrl(link)
                      return embedUrl ? (
                        <div key={index} className="aspect-video bg-muted rounded overflow-hidden">
                          <iframe
                            src={embedUrl}
                            title={`YouTube video ${index + 1}`}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      ) : null
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>

            {/* Additional Details */}
            {(service.requirements || service.features || service.amenities || service.services) && (
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.requirements && (
                    <div>
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {service.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {service.features && (
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, index) => (
                          <Badge key={index} variant="outline">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {service.amenities && (
                    <div>
                      <h4 className="font-medium mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {service.services && (
                    <div>
                      <h4 className="font-medium mb-2">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.services.map((svc, index) => (
                          <Badge key={index} variant="outline">
                            {svc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Service Info */}
            <Card>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.company}</CardDescription>
                {service.rating && (
                  <div className="flex items-center gap-1">
                    {Array(service.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      ))}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {service.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{service.location}</span>
                    </div>
                  )}

                  {service.contact && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{service.contact}</span>
                    </div>
                  )}

                  {service.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{service.email}</span>
                    </div>
                  )}

                  {service.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Link href={service.website} target="_blank" className="text-sm text-primary hover:underline">
                        Visit Website
                      </Link>
                    </div>
                  )}
                </div>

                {service.price && (
                  <div>
                    <p className="text-2xl font-bold text-primary">{service.price}</p>
                  </div>
                )}

                <Separator />

                {params.serviceType === "jobs" ? (
                  <Button
                    onClick={() => setShowJobApplicationDialog(true)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    size="lg"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Apply Now
                  </Button>
                ) : (
                  <Button onClick={handleBooking} className="w-full" size="lg">
                    Book Now
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {service.contact && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`tel:${service.contact}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                )}

                {service.email && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`mailto:${service.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </a>
                  </Button>
                )}

                <Button variant="outline" className="w-full" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Service
                </Button>
              </CardContent>
            </Card>

            {/* Sidebar Advertisements */}
            <PlacementAdvertisements placement="sidebar" maxAds={2} />
          </div>
        </div>
      </div>

      {/* Job Application Dialog */}
      {params.serviceType === "jobs" && service && (
        <JobApplicationDialog
          isOpen={showJobApplicationDialog}
          onClose={() => setShowJobApplicationDialog(false)}
          jobTitle={service.title}
          jobId={service.id || ""}
        />
      )}
    </div>
  )

  // No payment gate - all services are free to view
  // Payment only happens when accessing videos or specific actions
  return pageContent
}
