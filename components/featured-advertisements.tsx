"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { collection, getDocs, query, where, limit } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Advertisement } from "@/lib/types"
import { Clock, MapPin, Building2, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

// Function to format text with markdown-style formatting
const formatText = (text: string) => {
  if (!text) return text

  return (
    text
      // Bold: *text* or **text**
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
      // Italic: _text_
      .replace(/_(.*?)_/g, "<em>$1</em>")
      // Underline: __text__
      .replace(/__(.*?)__/g, "<u>$1</u>")
      // Line breaks
      .replace(/\n/g, "<br>")
  )
}

export function FeaturedAdvertisements() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          console.log("Firebase DB not available")
          return
        }

        console.log("Fetching advertisements for main section...")
        const q = query(collection(db, "advertisements"), where("status", "==", "active"), limit(20))

        const querySnapshot = await getDocs(q)
        console.log(`Found ${querySnapshot.size} active advertisements`)
        
        const ads: Advertisement[] = []
        const now = new Date().toISOString()
        
        querySnapshot.forEach((doc) => {
          const adData = doc.data() as Advertisement
          console.log("Advertisement data:", { 
            id: doc.id, 
            title: adData.title, 
            status: adData.status,
            placement: adData.placement,
            endDate: adData.endDate,
            hasImages: adData.images?.length || 0,
            expired: adData.endDate ? adData.endDate < now : false
          })
          
          // Only show ads for "advertisement-section" placement or no placement (old ads)
          const isCorrectPlacement = !adData.placement || adData.placement === "advertisement-section"
          const notExpired = !adData.endDate || adData.endDate > now
          
          console.log(`Placement check for ${adData.title}:`, {
            hasPlacement: !!adData.placement,
            placementValue: adData.placement,
            isCorrectPlacement,
            notExpired
          })
          
          // Filter out expired ads and wrong placement
          if (isCorrectPlacement && notExpired) {
            ads.push({ id: doc.id, ...adData })
            console.log(`✓ Including ad: ${adData.title} (placement: ${adData.placement || "default"})`)
          } else {
            console.log(`✗ Excluding ad: ${adData.title} - correct placement: ${isCorrectPlacement}, not expired: ${notExpired}`)
          }
        })

        console.log(`Final advertisements count: ${ads.length}`)
        // Take only first 6 after filtering
        setAdvertisements(ads.slice(0, 6))
      } catch (error) {
        console.error("Error fetching advertisements:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdvertisements()
  }, [])

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/30 dark:via-gray-950 dark:to-purple-950/30">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Featured Promotions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-700 to-purple-600 dark:from-white dark:via-blue-300 dark:to-purple-400 bg-clip-text text-transparent">
              Featured Advertisements
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-muted rounded-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-4"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/30 dark:via-gray-950 dark:to-purple-950/30">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Featured Promotions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-700 to-purple-600 dark:from-white dark:via-blue-300 dark:to-purple-400 bg-clip-text text-transparent">
            Featured Advertisements
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing deals and opportunities from our featured partners
          </p>
          
          {/* Advertise with us banner */}
          <div className="mt-8 max-w-4xl mx-auto">
            <Link href="/submit-advertisement">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 border-dashed border-blue-300 dark:border-blue-700 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 overflow-hidden">
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                      <Sparkles className="h-8 w-8" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Advertise with us!
                      </h3>
                      <p className="text-muted-foreground">
                        Reach thousands of potential customers. Start from KSh 200/day
                      </p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg group-hover:shadow-xl transition-all">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Advertisements Grid */}
        {advertisements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advertisements.map((ad) => (
            <Card
              key={ad.id}
              className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden"
            >
              <CardContent className="p-0">
                {/* Image */}
                {ad.images && ad.images.length > 0 && (
                  <div className="aspect-video w-full bg-white rounded-t-lg overflow-hidden relative">
                    <img
                      src={ad.images[0] || "/placeholder.svg"}
                      alt={ad.title}
                      className="w-full h-full object-contain bg-white transition-transform duration-500 group-hover:scale-105"
                      style={{ minHeight: "200px", maxHeight: "250px" }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=250&width=400&text=${encodeURIComponent(ad.title || "Advertisement")}`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Ad Type Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
                        {ad.adType?.toUpperCase() || "FEATURED"}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                      {ad.title}
                    </h3>

                    {ad.company && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{ad.company}</span>
                      </div>
                    )}

                    {ad.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{ad.location}</span>
                      </div>
                    )}
                  </div>

                  {ad.description && (
                    <div
                      className="text-sm text-muted-foreground line-clamp-3 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatText(ad.description) }}
                    />
                  )}

                  {/* Price */}
                  {ad.price && <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{ad.price}</div>}

                  {/* Duration */}
                  {ad.startDate && ad.endDate && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Valid until {new Date(ad.endDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    asChild
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300"
                  >
                    <Link href={`/advertisements/${ad.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No featured advertisements at the moment. Be the first to advertise!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
