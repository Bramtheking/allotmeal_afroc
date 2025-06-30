"use client"

import { useEffect, useState } from "react"
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Advertisement } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export function FeaturedAdvertisements() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) return

        const q = query(
          collection(db, "advertisements"),
          where("status", "==", "active"),
          orderBy("createdAt", "desc"),
          limit(6),
        )

        const querySnapshot = await getDocs(q)
        const adData: Advertisement[] = []

        querySnapshot.forEach((doc) => {
          adData.push({ id: doc.id, ...doc.data() } as Advertisement)
        })

        setAdvertisements(adData)
      } catch (error) {
        console.error("Error fetching advertisements:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdvertisements()
  }, [])

  // Format text with basic markdown support
  const formatText = (text: string) => {
    if (!text) return ""

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

    return formattedText
  }

  // Don't render anything if loading or no advertisements
  if (loading || advertisements.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Opportunities</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest opportunities and services from our trusted partners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertisements.map((ad) => (
            <Card key={ad.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Fixed Image Display - Show Full Image */}
              <div className="w-full bg-white border-b" style={{ minHeight: "200px", maxHeight: "250px" }}>
                {ad.images && ad.images.length > 0 ? (
                  <img
                    src={ad.images[0] || "/placeholder.svg"}
                    alt={ad.title}
                    className="w-full h-full object-contain bg-white"
                    style={{ minHeight: "200px", maxHeight: "250px" }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center bg-muted"
                    style={{ minHeight: "200px" }}
                  >
                    <span className="text-muted-foreground">No image available</span>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2 leading-tight">{ad.title}</CardTitle>
                {ad.company && (
                  <CardDescription className="text-sm font-medium text-primary/80">{ad.company}</CardDescription>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                {/* Description with Rich Text Support */}
                <div
                  className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatText(ad.description) }}
                />

                <div className="space-y-2 mb-4">
                  {ad.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{ad.location}</span>
                    </div>
                  )}
                  {ad.contact && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{ad.contact}</span>
                    </div>
                  )}
                  {ad.price && <p className="font-semibold text-lg text-yellow-600 dark:text-yellow-400">{ad.price}</p>}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" asChild>
                    <Link href={`/advertisements/${ad.id}`}>Learn More</Link>
                  </Button>
                  {ad.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={ad.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/advertisements">View All Advertisements</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
