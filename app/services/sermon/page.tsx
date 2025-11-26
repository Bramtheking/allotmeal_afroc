"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  Calendar,
  User,
  Play,
  Eye,
  Heart,
  Book,
  Loader2,
  Phone,
  Filter,
  Users,
  Music,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

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

const getMockSermons = (): Sermon[] => [
  {
    id: "1",
    title: "Walking in Faith Through Difficult Times",
    description: "A powerful message about maintaining faith and trust in God during life's challenging seasons.",
    preacher: "Pastor John Mensah",
    sermonDate: "2024-01-15",
    sermonTime: "10:00 AM",
    topic: "Faith & Trust",
    scripture: "Romans 8:28",
    language: "English",
    denomination: "Methodist",
    location: "Accra, Ghana",
    sermonType: "recorded",
    views: 2500,
  },
  {
    id: "2",
    title: "The Power of Prayer in Community",
    description: "Understanding how collective prayer strengthens our relationship with God and each other.",
    preacher: "Rev. Sarah Okafor",
    sermonDate: "2024-01-20",
    sermonTime: "6:00 PM",
    topic: "Prayer & Community",
    scripture: "Matthew 18:20",
    language: "English",
    denomination: "Baptist",
    location: "Lagos, Nigeria",
    sermonType: "live",
    views: 1800,
  },
  {
    id: "3",
    title: "God's Grace in Times of Abundance",
    description: "Learning to be grateful and generous when God blesses us with abundance.",
    preacher: "Bishop David Kiprotich",
    sermonDate: "2024-01-25",
    sermonTime: "9:00 AM",
    topic: "Grace & Gratitude",
    scripture: "2 Corinthians 9:8",
    language: "English",
    denomination: "Anglican",
    location: "Nairobi, Kenya",
    sermonType: "upcoming",
  },
]

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          console.log("[v0] Using mock data for sermons")
          const mockData = getMockSermons()
          setSermons(mockData)
          setFilteredSermons(mockData)
          setLoading(false)
          return
        }

        const sermonsRef = collection(db, "services")
        const q = query(sermonsRef, where("serviceType", "==", "sermon"), orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q)

        const sermonsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Sermon[]

        console.log("[v0] Fetched sermon data from Firebase:", sermonsData.length, "items")
        setSermons(sermonsData)
        setFilteredSermons(sermonsData)
      } catch (error) {
        console.error("Error fetching sermons:", error)
        const mockData = getMockSermons()
        setSermons(mockData)
        setFilteredSermons(mockData)
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
          sermon.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((sermon) => sermon.sermonType === filterType)
    }

    setFilteredSermons(filtered)
  }, [searchTerm, filterType, sermons])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/20 dark:via-gray-950 dark:to-purple-950/20">
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <span className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Loading sermons...
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/20 dark:via-gray-950 dark:to-purple-950/20">
      {/* Hero Section */}
      <div className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 via-purple-400/20 to-violet-500/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="container relative py-20">
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="outline"
              size="icon"
              asChild
              className="bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30"
            >
              <Link href="/#services">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              Sermons &
              <br />
              <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Spiritual Messages
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Experience powerful messages, inspirational teachings, and spiritual guidance from renowned preachers
              across Africa and beyond.
            </p>
          </motion.div>

          {/* Sermon Search Box */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Topic or Preacher</label>
                  <div className="relative">
                    <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-500" />
                    <Input
                      placeholder="Search sermons..."
                      className="pl-10 h-12 border-gray-200 focus:border-indigo-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Content Type</label>
                  <div className="relative">
                    <Play className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="pl-10 h-12 border-gray-200 focus:border-purple-400">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="live">Live Streaming</SelectItem>
                        <SelectItem value="recorded">Recorded</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Language</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-500" />
                    <select className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-violet-400 bg-white">
                      <option value="">All Languages</option>
                      <option value="english">English</option>
                      <option value="french">French</option>
                      <option value="swahili">Swahili</option>
                      <option value="arabic">Arabic</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <Button className="flex-1 h-12 text-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Find Sermons
                </Button>
                <Button variant="outline" className="md:w-auto h-12 border-gray-300 hover:bg-gray-50 bg-transparent">
                  <Filter className="mr-2 h-4 w-4" />
                  More Options
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-20">
        {/* Featured Sermons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Inspirational Messages
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover powerful sermons that inspire, encourage, and strengthen your faith journey
            </p>
          </div>

          {filteredSermons.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
                <Book className="h-20 w-20 text-indigo-500" />
              </div>
              <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Inspiring Sermons Coming Soon
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                We're curating powerful messages from Africa's most inspiring spiritual leaders. Life-changing sermons
                and teachings will be available soon!
              </p>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-lg px-8 py-3">
                Subscribe for Updates
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSermons.map((sermon, index) => (
                <motion.div
                  key={sermon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border-0 h-full">
                    <div className="relative">
                      <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="h-16 w-16 text-indigo-500" />
                        </div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                      </div>

                      <div className="absolute top-4 right-4">
                        <Badge
                          className={
                            sermon.sermonType === "live"
                              ? "bg-red-500 text-white animate-pulse"
                              : sermon.sermonType === "upcoming"
                                ? "bg-orange-500 text-white"
                                : "bg-green-500 text-white"
                          }
                        >
                          {(sermon.sermonType || "recorded").toUpperCase()}
                        </Badge>
                      </div>

                      {sermon.sermonType === "recorded" && (
                        <div className="absolute bottom-4 right-4">
                          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{sermon.views || "1.2K"} views</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                        {sermon.title}
                      </CardTitle>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4 text-indigo-500" />
                          <span className="text-sm font-medium">{sermon.preacher}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Book className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">{sermon.topic}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 text-violet-500" />
                          <span className="text-sm">{sermon.sermonDate}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{sermon.description}</p>

                      {sermon.scripture && (
                        <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-l-4 border-indigo-400">
                          <p className="text-sm font-medium text-indigo-700">{sermon.scripture}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {sermon.denomination && (
                          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                            {sermon.denomination}
                          </Badge>
                        )}
                        {sermon.language && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            {sermon.language}
                          </Badge>
                        )}
                      </div>
                    </CardContent>

                    <div className="p-6 pt-0">
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                      >
                        <Link href={`/services/sermon/${sermon.id}`}>
                          <Play className="mr-2 h-4 w-4" />
                          {sermon.sermonType === "live"
                            ? "Watch Live"
                            : sermon.sermonType === "upcoming"
                              ? "Set Reminder"
                              : "Watch Sermon"}
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Why Choose Our Platform */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-indigo-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Inspiring Content</h3>
            <p className="text-gray-600 leading-relaxed">
              Messages that touch hearts, transform lives, and strengthen faith communities.
            </p>
          </div>

          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
              <Music className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Quality Audio/Video</h3>
            <p className="text-gray-600 leading-relaxed">
              Crystal-clear streaming with professional audio and video production.
            </p>
          </div>

          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-indigo-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Global Community</h3>
            <p className="text-gray-600 leading-relaxed">
              Join believers worldwide in worship, learning, and spiritual growth.
            </p>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-indigo-400/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-3xl border border-indigo-100 shadow-2xl text-center">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Need Spiritual Guidance?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with our pastoral team for prayer, counseling, or spiritual support and guidance.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button className="h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-8">
                <Phone className="mr-2 h-4 w-4" />
                Contact Pastoral Care
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

