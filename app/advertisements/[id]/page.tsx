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
import { ArrowLeft, MapPin, Phone, Globe, Eye, Play, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function AdvertisementDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  const formatText = (text: string) => {
    // Convert markdown-style formatting to HTML
    const formattedText = text
      // Bold: **text** or *text*
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
      // Italic: _text_
      .replace(/_(.*?)_/g, "<em>$1</em>")
      // Underline: __text__
      .replace(/__(.*?)__/g, "<u>$1</u>")
      // Line breaks
      .replace(/\n/g, "<br>")
      // Links: [text](url)
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>',
      )

    return formattedText
  }

  const nextImage = () => {
    if (advertisement?.images && advertisement.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % advertisement.images!.length)
    }
  }

  const prevImage = () => {
    if (advertisement?.images && advertisement.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + advertisement.images!.length) % advertisement.images!.length)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: advertisement?.title || "Check out this advertisement",
      text: `${advertisement?.title} - ${advertisement?.company}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast.success("Shared successfully!")
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard!")
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        // Fallback: copy link to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href)
          toast.success("Link copied to clipboard!")
        } catch (clipboardError) {
          toast.error("Failed to share")
        }
      }
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
            {/* Images with Carousel */}
            {advertisement.images && advertisement.images.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    {/* Main Image Display - Full Size */}
                    <div className="w-full bg-muted rounded-t-lg overflow-hidden" style={{ minHeight: "400px" }}>
                      <img
                        src={advertisement.images[currentImageIndex] || "/placeholder.svg"}
                        alt={`${advertisement.title} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain bg-white"
                        style={{ maxHeight: "600px" }}
                      />
                    </div>

                    {/* Navigation Arrows */}
                    {advertisement.images.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>

                        {/* Image Counter */}
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          {currentImageIndex + 1} / {advertisement.images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {advertisement.images.length > 1 && (
                    <div className="p-4">
                      <div className="grid grid-cols-6 gap-2">
                        {advertisement.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`aspect-square bg-muted rounded overflow-hidden border-2 transition-all ${
                              index === currentImageIndex
                                ? "border-primary"
                                : "border-transparent hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`${advertisement.title} thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
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
                      <div key={index} className="bg-muted rounded overflow-hidden">
                        <video src={video} controls className="w-full h-auto" style={{ maxHeight: "300px" }} />
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

            {/* Description with Rich Text Formatting */}
            <Card>
              <CardHeader>
                <CardTitle>About This Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatText(advertisement.description) }}
                />
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
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {advertisement.contact && (
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href={`tel:${advertisement.contact}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                )}

                {advertisement.website && (
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href={advertisement.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}

                <Button variant="outline" className="w-full bg-transparent" onClick={handleShare}>
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
