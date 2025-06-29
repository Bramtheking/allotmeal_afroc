"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, updateDoc, increment } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Advertisement } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Phone, Globe, Eye, Play, ExternalLink } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function AdvertisementDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db || !params.id) return

        const docRef = doc(db, "advertisements", params.id as string)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const adData = { id: docSnap.id, ...docSnap.data() } as Advertisement
          setAdvertisement(adData)

          // Increment view count
          await updateDoc(docRef, {
            impressions: increment(1),
          })
        } else {
          toast.error("Advertisement not found")
          router.back()
        }
      } catch (error) {
        console.error("Error fetching advertisement:", error)
        toast.error("Failed to load advertisement details")
      } finally {
        setLoading(false)
      }
    }

    fetchAdvertisement()
  }, [params.id, router])

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null
  }

  const handleLearnMore = () => {
    if (advertisement?.website) {
      window.open(advertisement.website, "_blank")
    } else if (advertisement?.contact) {
      window.open(`tel:${advertisement.contact}`, "_blank")
    } else {
      toast.info("Contact information not available")
    }
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading advertisement details...</span>
        </div>
      </div>
    )
  }

  if (!advertisement) {
    return (
      <div className="container py-32">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Advertisement Not Found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-yellow-950/30 dark:via-gray-950 dark:to-blue-950/30">
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{advertisement.impressions || 0} views</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {advertisement.images && advertisement.images.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video w-full bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={advertisement.images[0] || "/placeholder.svg"}
                      alt={advertisement.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {advertisement.images.length > 1 && (
                    <div className="p-4">
                      <div className="grid grid-cols-4 gap-2">
                        {advertisement.images.slice(1, 5).map((image, index) => (
                          <div key={index} className="aspect-square bg-muted rounded overflow-hidden">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`${advertisement.title} ${index + 2}`}
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
            {advertisement.videos && advertisement.videos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {advertisement.videos.map((video, index) => (
                      <div key={index} className="aspect-video bg-muted rounded overflow-hidden">
                        <video src={video} controls className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* YouTube Videos */}
            {advertisement.youtubeLinks && advertisement.youtubeLinks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    YouTube Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {advertisement.youtubeLinks.map((link, index) => {
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
                <CardTitle>About This Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{advertisement.description}</p>
              </CardContent>
            </Card>

            {/* Campaign Details */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Campaign Type</p>
                    <Badge variant="outline">{advertisement.adType}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <Badge variant={advertisement.status === "active" ? "default" : "secondary"}>
                      {advertisement.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(advertisement.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">End Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(advertisement.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Advertisement Info */}
            <Card>
              <CardHeader>
                <CardTitle>{advertisement.title}</CardTitle>
                <CardDescription>{advertisement.company}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {advertisement.price && (
                  <div>
                    <p className="text-2xl font-bold text-primary">{advertisement.price}</p>
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  {advertisement.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{advertisement.location}</span>
                    </div>
                  )}

                  {advertisement.contact && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{advertisement.contact}</span>
                    </div>
                  )}

                  {advertisement.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Link
                        href={advertisement.website}
                        target="_blank"
                        className="text-sm text-primary hover:underline"
                      >
                        Visit Website
                      </Link>
                    </div>
                  )}
                </div>

                <Separator />

                <Button onClick={handleLearnMore} className="w-full" size="lg">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {advertisement.contact && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`tel:${advertisement.contact}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                )}

                {advertisement.website && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={advertisement.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}

                <Button variant="outline" className="w-full">
                  Share Advertisement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
