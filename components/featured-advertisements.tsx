"use client"

import { useEffect, useState } from "react"
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Advertisement } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, MapPin, Phone } from "lucide-react"

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
              <div className="aspect-video w-full bg-muted">
                {ad.images && ad.images.length > 0 ? (
                  <img src={ad.images[0] || "/placeholder.svg"} alt={ad.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg line-clamp-1">{ad.title}</CardTitle>
                {ad.company && <CardDescription>{ad.company}</CardDescription>}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{ad.description}</p>

                <div className="space-y-2 mb-4">
                  {ad.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{ad.location}</span>
                    </div>
                  )}
                  {ad.contact && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{ad.contact}</span>
                    </div>
                  )}
                  {ad.price && <p className="font-semibold text-yellow-600 dark:text-yellow-400">{ad.price}</p>}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">Learn More</Button>
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
      </div>
    </section>
  )
}
