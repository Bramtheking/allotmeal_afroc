"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { collection, getDocs, query, where, limit } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Advertisement } from "@/lib/types"
import { MapPin, Building2, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"

interface PlacementAdvertisementsProps {
  placement: "below-video" | "below-services" | "sidebar"
  maxAds?: number
}

// Function to format text with markdown-style formatting
const formatText = (text: string) => {
  if (!text) return text

  return (
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/__(.*?)__/g, "<u>$1</u>")
      .replace(/\n/g, "<br>")
  )
}

export function PlacementAdvertisements({ placement, maxAds = 6 }: PlacementAdvertisementsProps) {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          console.log("Firebase DB not available")
          setLoading(false)
          return
        }

        console.log(`Fetching advertisements for placement: ${placement}`)
        const q = query(
          collection(db, "advertisements"),
          where("status", "==", "active"),
          where("placement", "==", placement),
          limit(maxAds)
        )

        const querySnapshot = await getDocs(q)
        console.log(`Found ${querySnapshot.size} active advertisements for ${placement}`)
        
        const ads: Advertisement[] = []
        const now = new Date().toISOString()
        
        querySnapshot.forEach((doc) => {
          const adData = doc.data() as Advertisement
          
          // Filter out expired ads
          if (!adData.endDate || adData.endDate > now) {
            ads.push({ id: doc.id, ...adData })
            console.log(`✓ Including ad: ${adData.title} at ${placement}`)
          } else {
            console.log(`✗ Excluding expired ad: ${adData.title}`)
          }
        })

        console.log(`Final advertisements count for ${placement}: ${ads.length}`)
        setAdvertisements(ads)
      } catch (error) {
        console.error(`Error fetching advertisements for ${placement}:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdvertisements()
  }, [placement, maxAds])

  if (loading) {
    return null // Don't show loading state for placement ads
  }

  if (advertisements.length === 0) {
    return null // Don't show anything if no ads
  }

  // Different layouts based on placement
  if (placement === "sidebar") {
    return (
      <div className="space-y-4">
        {advertisements.map((ad) => (
          <Card key={ad.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {ad.images && ad.images.length > 0 && (
                <div className="aspect-square w-full bg-white overflow-hidden">
                  <img
                    src={ad.images[0]}
                    alt={ad.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="p-4 space-y-2">
                <h4 className="font-semibold line-clamp-2">{ad.title}</h4>
                {ad.price && <p className="text-lg font-bold text-blue-600">{ad.price}</p>}
                <Button asChild size="sm" className="w-full">
                  <Link href={`/advertisements/${ad.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Default layout for below-video and below-services
  return (
    <section className="py-12 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950/30 dark:via-gray-950 dark:to-blue-950/30">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertisements.map((ad) => (
            <Card
              key={ad.id}
              className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden"
            >
              <CardContent className="p-0">
                {ad.images && ad.images.length > 0 && (
                  <div className="aspect-video w-full bg-white rounded-t-lg overflow-hidden relative">
                    <img
                      src={ad.images[0]}
                      alt={ad.title}
                      className="w-full h-full object-contain bg-white transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg">
                        {ad.adType?.toUpperCase() || "FEATURED"}
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 line-clamp-2">
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

                  {ad.price && <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{ad.price}</div>}

                  {ad.startDate && ad.endDate && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Valid until {new Date(ad.endDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  <Button
                    asChild
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-300"
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
      </div>
    </section>
  )
}
