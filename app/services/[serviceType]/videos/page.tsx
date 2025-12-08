"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, ExternalLink, Calendar, User, Eye } from "lucide-react"
import Link from "next/link"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import VisitorTracker from "@/components/visitor-tracker"

interface Service {
  id: string
  title: string
  description: string
  serviceType: string
  videos?: string[]
  youtubeLinks?: string[]
  createdAt: any
  createdBy: string
}

interface PageProps {
  params: {
    serviceType: string
  }
}

export default function ServiceVideosPage({ params }: PageProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const serviceType = params.serviceType

  useEffect(() => {
    const fetchServicesWithVideos = async () => {
      try {
        const db = getFirebaseDb()
        if (!db) {
          setError("Database not available")
          return
        }

        const servicesRef = collection(db, "services")
        const q = query(servicesRef, where("serviceType", "==", serviceType))
        const snapshot = await getDocs(q)

        const servicesData: Service[] = []
        snapshot.docs.forEach((doc) => {
          const data = doc.data()
          // Only include services that have videos or YouTube links
          if ((data.videos && data.videos.length > 0) || (data.youtubeLinks && data.youtubeLinks.length > 0)) {
            servicesData.push({
              id: doc.id,
              ...data,
            } as Service)
          }
        })

        setServices(servicesData)
      } catch (error) {
        console.error("Error fetching services:", error)
        setError("Failed to load videos")
      } finally {
        setLoading(false)
      }
    }

    fetchServicesWithVideos()
  }, [serviceType])

  const formatServiceType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const isYouTubeLive = (url: string) => {
    return url.includes("youtube.com/watch") && url.includes("live")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-gray-900">
        <div className="container py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading videos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-gray-900">
        <div className="container py-8">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <Button asChild className="mt-4">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-gray-900">
      <VisitorTracker page={`/services/${serviceType}/videos`} />
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{formatServiceType(serviceType)} Videos</h1>
            <p className="text-muted-foreground">Watch videos and media content for this service category</p>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Videos Available</h3>
              <p className="text-muted-foreground mb-6">
                There are currently no videos available for {formatServiceType(serviceType)} services.
              </p>
              <Button asChild>
                <Link href={`/services/${serviceType}`}>View Services Instead</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="space-y-4">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      </div>
                      <Badge variant="secondary">{formatServiceType(service.serviceType)}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {service.createdBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {service.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Uploaded Videos */}
                    {service.videos && service.videos.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Play className="h-4 w-4 text-green-600" />
                          Uploaded Videos
                        </h4>
                        {service.videos.map((videoUrl, index) => (
                          <div key={index} className="space-y-2">
                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                              <video
                                controls
                                className="w-full h-full object-contain"
                                preload="metadata"
                                poster={`${videoUrl}#t=0.5`}
                              >
                                <source src={videoUrl} type="video/mp4" />
                                <source src={videoUrl} type="video/webm" />
                                <source src={videoUrl} type="video/ogg" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="font-medium">Video {index + 1}</span>
                              <a
                                href={videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-primary transition-colors"
                              >
                                Open in new tab
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* YouTube Links */}
                    {service.youtubeLinks && service.youtubeLinks.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">YouTube Content</h4>
                        {service.youtubeLinks.map((youtubeUrl, index) => {
                          const videoId = getYouTubeVideoId(youtubeUrl)
                          const isLive = isYouTubeLive(youtubeUrl)

                          return (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Play className="h-4 w-4 text-red-600" />
                                  {isLive && (
                                    <Badge variant="destructive" className="text-xs px-1 py-0">
                                      LIVE
                                    </Badge>
                                  )}
                                </div>
                                <a
                                  href={youtubeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline flex-1 truncate"
                                >
                                  YouTube {isLive ? "Live" : "Video"} {index + 1}
                                </a>
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              </div>

                              {videoId && (
                                <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                  <iframe
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title={`YouTube video ${index + 1}`}
                                    className="w-full h-full"
                                    allowFullScreen
                                  />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
