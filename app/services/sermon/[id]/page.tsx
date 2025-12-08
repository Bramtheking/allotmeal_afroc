"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Church,
  Calendar,
  Clock,
  User,
  Play,
  BookOpen,
  Heart,
  Share2,
  Download,
  ArrowLeft,
  Volume2,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getFirebaseDb } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

interface Sermon {
  id: string
  title: string
  description: string
  preacher: string
  date: string
  duration: string
  category: string
  thumbnail?: string
  videoUrl?: string
  audioUrl?: string
  scripture?: string
  tags?: string[]
  fullDescription?: string
  notes?: string
}

export default function SermonDetailPage() {
  const params = useParams()
  const sermonId = params.id as string
  const [sermon, setSermon] = useState<Sermon | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    fetchSermon()
  }, [sermonId])

  const fetchSermon = async () => {
    try {
      const db = getFirebaseDb()
      if (!db) {
        // Fallback to mock data if Firebase is not available
        setSermon(getMockSermon(sermonId))
        setLoading(false)
        return
      }

      const sermonRef = doc(db, "sermons", sermonId)
      const sermonSnap = await getDoc(sermonRef)

      if (sermonSnap.exists()) {
        setSermon({ id: sermonSnap.id, ...sermonSnap.data() } as Sermon)
      } else {
        setSermon(getMockSermon(sermonId))
      }
    } catch (error) {
      console.error("Error fetching sermon:", error)
      setSermon(getMockSermon(sermonId))
    } finally {
      setLoading(false)
    }
  }

  const getMockSermon = (id: string): Sermon => {
    const mockSermons: Record<string, Sermon> = {
      "1": {
        id: "1",
        title: "Walking in Faith",
        description: "A powerful message about trusting God in uncertain times and finding strength through faith.",
        preacher: "Pastor John Smith",
        date: "2024-01-21",
        duration: "45 min",
        category: "Faith",
        thumbnail: "/placeholder.svg?height=400&width=600",
        scripture: "Hebrews 11:1",
        tags: ["faith", "trust", "hope"],
        fullDescription:
          "In this inspiring sermon, we explore what it truly means to walk by faith and not by sight. Pastor John Smith takes us through the biblical foundations of faith and how we can apply these principles in our daily lives, especially during challenging times.",
        notes:
          "Key Points:\n1. Faith is the substance of things hoped for\n2. Walking by faith requires trust in God's plan\n3. Faith grows through trials and testing\n4. Community support strengthens our faith journey",
      },
    }

    return mockSermons[id] || mockSermons["1"]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sermon?.title,
          text: sermon?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 dark:from-slate-950 dark:via-gray-900 dark:to-violet-950/10">
        <div className="container py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-8"></div>
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-8"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!sermon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 dark:from-slate-950 dark:via-gray-900 dark:to-violet-950/10">
        <div className="container py-12">
          <div className="text-center">
            <Church className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Sermon Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The sermon you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/services/sermon">← Back to Sermons</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 dark:from-slate-950 dark:via-gray-900 dark:to-violet-950/10">
      <div className="container py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/services/sermon">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sermons
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video/Audio Player */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
                <img
                  src={sermon.thumbnail || "/placeholder.svg?height=400&width=600"}
                  alt={sermon.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-white/90 hover:bg-white text-gray-900 w-20 h-20 rounded-full"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {sermon.duration}
                </div>
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-violet-500 to-purple-500">
                  {sermon.category}
                </Badge>
              </div>
            </Card>

            {/* Sermon Details */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-4">
                  {sermon.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-3xl font-bold">{sermon.title}</CardTitle>
                <CardDescription className="text-lg">{sermon.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{sermon.preacher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>{formatDate(sermon.date)}</span>
                  </div>
                  {sermon.scripture && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{sermon.scripture}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {sermon.fullDescription && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">About This Sermon</h3>
                    <p className="text-muted-foreground leading-relaxed">{sermon.fullDescription}</p>
                  </div>
                )}

                {sermon.notes && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Sermon Notes
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm">{sermon.notes}</pre>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  {sermon.audioUrl && (
                    <Button variant="outline">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Audio Only
                    </Button>
                  )}
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Sermons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Sermons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <img
                      src="/placeholder.svg?height=60&width=80"
                      alt="Related sermon"
                      className="w-20 h-15 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">Related Sermon Title {i}</h4>
                      <p className="text-xs text-muted-foreground">Pastor Name</p>
                      <p className="text-xs text-muted-foreground">25 min</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Scripture Reference */}
            {sermon.scripture && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Scripture Reference
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-lg">
                    <p className="font-semibold text-lg text-violet-700 dark:text-violet-300">{sermon.scripture}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      "Now faith is the substance of things hoped for, the evidence of things not seen."
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Pastor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connect with Pastor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Have questions about this sermon or need spiritual guidance?
                </p>
                <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
                  <Church className="h-4 w-4 mr-2" />
                  Contact Pastor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
