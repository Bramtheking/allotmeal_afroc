"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DebugAdsPage() {
  const [allAds, setAllAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllAds = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          setError("Firebase DB not available")
          return
        }

        console.log("Fetching ALL advertisements (no filters)...")
        const querySnapshot = await getDocs(collection(db, "advertisements"))
        
        const ads: any[] = []
        const now = new Date().toISOString()
        
        querySnapshot.forEach((doc) => {
          const adData = doc.data()
          ads.push({
            id: doc.id,
            title: adData.title,
            status: adData.status,
            startDate: adData.startDate,
            endDate: adData.endDate,
            isExpired: adData.endDate ? adData.endDate < now : false,
            hasImages: adData.images?.length || 0,
            createdAt: adData.createdAt,
            isSelfService: adData.isSelfService,
            paymentStatus: adData.paymentStatus,
            ...adData
          })
        })

        console.log(`Found ${ads.length} total advertisements`)
        setAllAds(ads)
      } catch (error: any) {
        console.error("Error fetching advertisements:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAllAds()
  }, [])

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Advertisement Debug View</h1>
      
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <p>Total Advertisements: {allAds.length}</p>
        <p>Active Status: {allAds.filter(ad => ad.status === "active").length}</p>
        <p>Not Expired: {allAds.filter(ad => !ad.isExpired).length}</p>
        <p>Active & Not Expired: {allAds.filter(ad => ad.status === "active" && !ad.isExpired).length}</p>
      </div>

      <div className="space-y-4">
        {allAds.map((ad) => (
          <Card key={ad.id} className={ad.status === "active" && !ad.isExpired ? "border-green-500" : "border-yellow-500"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{ad.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={ad.status === "active" ? "default" : "secondary"}>
                    {ad.status || "NO STATUS"}
                  </Badge>
                  {ad.isExpired && <Badge variant="destructive">Expired</Badge>}
                  {ad.isSelfService && <Badge variant="outline">Self-Service</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>ID:</strong> {ad.id}
                </div>
                <div>
                  <strong>Status:</strong> {ad.status || "MISSING"}
                </div>
                <div>
                  <strong>Start Date:</strong> {ad.startDate || "MISSING"}
                </div>
                <div>
                  <strong>End Date:</strong> {ad.endDate || "MISSING"}
                </div>
                <div>
                  <strong>Images:</strong> {ad.hasImages}
                </div>
                <div>
                  <strong>Created At:</strong> {typeof ad.createdAt === 'object' && ad.createdAt?.seconds 
                    ? new Date(ad.createdAt.seconds * 1000).toLocaleDateString()
                    : ad.createdAt || "MISSING"}
                </div>
                <div>
                  <strong>Payment Status:</strong> {ad.paymentStatus || "N/A"}
                </div>
                <div>
                  <strong>Will Show:</strong> {ad.status === "active" && !ad.isExpired ? "✅ YES" : "❌ NO"}
                </div>
              </div>
              {ad.description && (
                <div className="mt-4">
                  <strong>Description:</strong>
                  <p className="text-muted-foreground line-clamp-2">{ad.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
