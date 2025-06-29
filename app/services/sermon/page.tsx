"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Calendar, User, Play, Eye, Clock, MapPin } from "lucide-react"
import Link from "next/link"

interface Sermon {
  id: string
  title: string
  description: string
  preacher: string
  sermonDate: string
  sermonTime?: string
  topic: string
  scripture?: string
  language?: string
  denomination?: string
  location?: string
  sermonType: "live" | "recorded" | "upcoming"
  videos?: string[]
  youtubeLinks?: string[]
  views?: number
  createdAt?: any
}

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const db = getFirebaseDb()
        if (!db) return

        const sermonsRef = collection(db, "services")
        const q = query(sermonsRef, where("serviceType", "==", "sermon"), orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q)

        const sermonsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Sermon[]

        setSermons(sermonsData)
        setFilteredSermons(sermonsData)
      } catch (error) {
        console.error("Error fetching sermons:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSermons()
  }, [])

  useEffect(() => {
    let filtered = sermons

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (sermon) =>
          sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sermon.preacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sermon.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sermon.denomination?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((sermon) => sermon.sermonType === filterType)
    }

    setFilteredSermons(filtered)
  }, [searchTerm, filterType, sermons])

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return videoId ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg` : null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading sermons...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-violet-950/30 dark:via-gray-950 dark:to-purple-950/30">
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Sermons</h1>
          <p className="text-muted-foreground">
            Discover spiritual content, live services, and recorded sermons from various denominations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sermons, preachers, topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sermons</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="recorded">Recorded</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredSermons.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-4">No Sermons Found</h3>
            <p className="text-muted-foreground mb-8">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria."
                : "There are currently no sermons available."}
            </p>
            {(searchTerm || filterType !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterType("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSermons.map((sermon) => (
              <Card key={sermon.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  {/* Thumbnail */}
                  <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden mb-4 relative">
                    {sermon.youtubeLinks?.[0] ? (
                      <img
                        src={getYouTubeThumbnail(sermon.youtubeLinks[0]) || "/placeholder.svg"}
                        alt={sermon.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=200&width=300&text=Sermon"
                        }}
                      />
                    ) : sermon.videos?.[0] ? (
                      <video
                        src={sermon.videos[0]}
                        className="w-full h-full object-cover"
                        poster="/placeholder.svg?height=200&width=300&text=Sermon"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 flex items-center justify-center">
                        <Play className="h-12 w-12 text-violet-500" />
                      </div>
                    )}

                    <div className="absolute top-2 left-2">
                      <Badge
                        variant={
                          sermon.sermonType === "live"
                            ? "destructive"
                            : sermon.sermonType === "upcoming"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {sermon.sermonType.toUpperCase()}
                      </Badge>
                    </div>

                    {(sermon.videos?.length || sermon.youtubeLinks?.length) && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>

                  <CardTitle className="text-lg line-clamp-2">{sermon.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{sermon.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{sermon.preacher}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(sermon.sermonDate)}</span>
                      {sermon.sermonTime && (
                        <>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{sermon.sermonTime}</span>
                        </>
                      )}
                    </div>

                    {sermon.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{sermon.location}</span>
                      </div>
                    )}

                    {sermon.views && (
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{sermon.views} views</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{sermon.topic}</Badge>
                    {sermon.denomination && <Badge variant="outline">{sermon.denomination}</Badge>}
                    {sermon.language && <Badge variant="outline">{sermon.language}</Badge>}
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/services/sermon/${sermon.id}`}>
                      <Play className="h-4 w-4 mr-2" />
                      Watch Sermon
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
