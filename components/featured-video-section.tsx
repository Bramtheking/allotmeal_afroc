"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Play, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { getFirebaseDb } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export function FeaturedVideoSection() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    fetchFeaturedVideo()
  }, [])

  const fetchFeaturedVideo = async () => {
    try {
      const db = await getFirebaseDb()
      if (!db) {
        setLoading(false)
        return
      }

      const videoDoc = await getDoc(doc(db, "site_settings", "featured_video"))
      if (videoDoc.exists() && videoDoc.data().videoUrl) {
        setVideoUrl(videoDoc.data().videoUrl)
      }
    } catch (error) {
      console.error("Error fetching featured video:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  if (!videoUrl) {
    return null // Don't show section if no video
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-amber-700 to-orange-600 dark:from-white dark:via-amber-300 dark:to-orange-400 bg-clip-text text-transparent">
            Discover AllotMeal Afroc
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch our story and learn how we're connecting Africa through innovative solutions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <Card className="overflow-hidden shadow-2xl border-0 bg-black">
            <div className="relative aspect-video w-full">
              {!isPlaying ? (
                <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    poster={videoUrl}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-amber-500 group-hover:bg-amber-600 transition-all flex items-center justify-center shadow-2xl group-hover:scale-110">
                      <Play className="h-12 w-12 text-white ml-2" fill="white" />
                    </div>
                  </div>
                </div>
              ) : (
                <video
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  onEnded={() => setIsPlaying(false)}
                />
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
