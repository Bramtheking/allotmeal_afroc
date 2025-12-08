"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Phone,
  Play,
  Loader2,
  Music,
  Video,
  Clock,
  Users,
  Search,
  Filter,
  Star,
  Camera,
  Headphones,
  Heart,
  Eye,
  Mic,
  Radio,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
import { motion } from "framer-motion"

export default function EntertainmentPage() {
  const [entertainment, setEntertainment] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEntertainment = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          console.log("[v0] Firebase not available")
          setLoading(false)
          return
        }

        console.log("[v0] Fetching entertainment services from Firebase...")
        const q = query(
          collection(db, "services"),
          where("serviceType", "==", "entertainment"),
          where("status", "==", "active"),
        )

        const querySnapshot = await getDocs(q)
        const entertainmentData: Service[] = []

        querySnapshot.forEach((doc) => {
          entertainmentData.push({ id: doc.id, ...doc.data() } as Service)
        })

        console.log("[v0] Successfully fetched entertainment services from database:", entertainmentData.length)
        setEntertainment(entertainmentData)
      } catch (error) {
        console.error("[v0] Error fetching entertainment services:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEntertainment()
  }, [])

  const getEntertainmentByType = (type: string) => {
    // Since marketing dashboard doesn't save category field, show all entertainment
    return entertainment
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-gray-950 dark:to-pink-950/20">
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <span className="text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Loading entertainment...
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const liveEvents = getEntertainmentByType("live")
  const clipEntertainment = getEntertainmentByType("clip")
  const videoContent = getEntertainmentByType("videos")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-gray-950 dark:to-pink-950/20">
      {/* Hero Section with Search */}
      <div className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-400/20 to-violet-500/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
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
              Entertainment &
              <br />
              <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Media Content
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Discover amazing live shows, exclusive content, and premium entertainment from Africa's most talented
              creators and performers.
            </p>
          </motion.div>

          {/* Entertainment Search Box */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Content Type</label>
                  <div className="relative">
                    <Play className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                    <select className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-purple-400 bg-white">
                      <option value="">All Content</option>
                      <option value="live">Live Shows</option>
                      <option value="music">Music</option>
                      <option value="comedy">Comedy</option>
                      <option value="dance">Dance</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Genre</label>
                  <div className="relative">
                    <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-500" />
                    <select className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-pink-400 bg-white">
                      <option value="">Any Genre</option>
                      <option value="afrobeats">Afrobeats</option>
                      <option value="comedy">Comedy</option>
                      <option value="drama">Drama</option>
                      <option value="documentary">Documentary</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Duration</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-500" />
                    <select className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-violet-400 bg-white">
                      <option value="">Any Length</option>
                      <option value="short">Short (&lt; 10 min)</option>
                      <option value="medium">Medium (10-30 min)</option>
                      <option value="long">Long (30+ min)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <Button className="flex-1 h-12 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Discover Content
                </Button>
                <Button variant="outline" className="md:w-auto h-12 border-gray-300 hover:bg-gray-50 bg-transparent">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-20">
        {/* Featured Entertainment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Premium Entertainment Content
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From live concerts to exclusive shows, discover Africa's vibrant entertainment scene
            </p>
          </div>

          <Tabs defaultValue="live" className="mb-12">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
              <TabsTrigger
                value="live"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                <Mic className="h-4 w-4 mr-2" />
                Live
              </TabsTrigger>
              <TabsTrigger
                value="clip"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                Clips
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                <Video className="h-4 w-4 mr-2" />
                Videos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="live" className="space-y-6">
              {liveEvents.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                    <Radio className="h-20 w-20 text-purple-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Amazing Live Shows Coming
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    We're curating incredible live entertainment experiences. Concerts, shows, and events will be
                    streaming soon!
                  </p>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-3">
                    Get Early Access
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {liveEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 h-full">
                        <div className="relative">
                          <div className="aspect-[16/9] w-full overflow-hidden">
                            {event.images && event.images.length > 0 ? (
                              <img
                                src={
                                  event.images[0] ||
                                  "/placeholder.svg?height=300&width=400&query=live+entertainment+show" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                                <Radio className="h-20 w-20 text-purple-500" />
                              </div>
                            )}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="absolute top-4 right-4">
                            <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
                          </div>

                          <div className="absolute bottom-4 right-4">
                            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>{event.views || "1.2K"} watching</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardHeader className="pb-4">
                          <CardTitle className="text-xl font-bold group-hover:text-purple-600 transition-colors duration-300">
                            {event.title}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-purple-500" />
                              <span className="text-sm">{(event as any).artist || event.company || "Live Artist"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-pink-500" />
                              <span className="text-sm">{event.eventTime || "Started 2h ago"}</span>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{event.description}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                Music
                              </Badge>
                              <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                                Live
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Heart className="h-4 w-4 text-red-500" />
                              <span className="text-sm">234</span>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="pt-6">
                          <Button
                            asChild
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          >
                            <Link href={`/services/entertainment/${event.id}`}>
                              <Play className="mr-2 h-4 w-4" />
                              Watch Live
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="clip" className="space-y-6">
              {clipEntertainment.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                    <Camera className="h-20 w-20 text-purple-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Exclusive Clips Loading
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    Short-form content and exclusive clips from your favorite creators are being curated for you!
                  </p>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-3">
                    Browse Soon
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {clipEntertainment.map((clip, index) => (
                    <motion.div
                      key={clip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                        <div className="relative">
                          <div className="aspect-[9/16] w-full overflow-hidden">
                            {clip.images && clip.images.length > 0 ? (
                              <img
                                src={
                                  clip.images[0] ||
                                  "/placeholder.svg?height=400&width=300&query=entertainment+clip" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt={clip.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                <Camera className="h-12 w-12 text-purple-500" />
                              </div>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>

                        <div className="p-3">
                          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-purple-600 transition-colors">
                            {clip.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">{clip.views || "12K"} views</p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="space-y-6">
              {videoContent.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                    <Video className="h-20 w-20 text-purple-500" />
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Premium Videos Coming
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    High-quality video content including documentaries, movies, and series from African creators will be
                    available soon!
                  </p>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-3">
                    Subscribe Now
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoContent.map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 h-full">
                        <div className="relative">
                          <div className="aspect-[16/9] w-full overflow-hidden">
                            {video.images && video.images.length > 0 ? (
                              <img
                                src={
                                  video.images[0] ||
                                  "/placeholder.svg?height=300&width=400&query=video+content" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt={video.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                <Video className="h-16 w-16 text-purple-500" />
                              </div>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Play className="h-12 w-12 text-white" />
                          </div>

                          <div className="absolute bottom-4 right-4">
                            <Badge className="bg-black/70 text-white text-xs">{video.duration || "45:32"}</Badge>
                          </div>
                        </div>

                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-bold group-hover:text-purple-600 transition-colors">
                            {video.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-sm">{(video as any).creator || video.company || "Creator Name"}</span>
                            <span className="text-xs">•</span>
                            <span className="text-sm">{video.views || "25K"} views</span>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {video.description || "Premium video content from talented African creators."}
                          </p>
                        </CardContent>

                        <CardFooter className="pt-4">
                          <Button
                            asChild
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          >
                            <Link href={`/services/entertainment/${video.id}`}>
                              <Play className="mr-2 h-4 w-4" />
                              Watch Now
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Why Choose Our Entertainment Platform */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Headphones className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">High Quality</h3>
            <p className="text-gray-600 leading-relaxed">
              Crystal clear audio and HD video streaming for the best entertainment experience.
            </p>
          </div>

          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Exclusive Content</h3>
            <p className="text-gray-600 leading-relaxed">
              Access to premium shows, concerts, and content you won't find anywhere else.
            </p>
          </div>

          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Community</h3>
            <p className="text-gray-600 leading-relaxed">
              Join a vibrant community of entertainment lovers and connect with fellow fans.
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
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-3xl border border-purple-100 shadow-2xl text-center">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ready for Premium Entertainment?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Subscribe to access exclusive content, live shows, and connect with Africa's top entertainers.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button className="h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8">
                <Phone className="mr-2 h-4 w-4" />
                Contact Entertainment Team
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

