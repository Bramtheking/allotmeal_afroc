"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DebugAdsPage() {
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const db = await getFirebaseDb()
        if (!db) {
          console.log("No database")
          setLoading(false)
          return
        }

        const querySnapshot = await getDocs(collection(db, "advertisements"))
        const allAds: any[] = []
        
        querySnapshot.forEach((doc) => {
          allAds.push({ id: doc.id, ...doc.data() })
        })

        console.log("All ads from database:", allAds)
        setAds(allAds)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  const now = new Date().toISOString()

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Advertisement Debug Page</h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-bold mb-2">Current Time:</h2>
        <p className="font-mono">{now}</p>
      </div>

      <div className="space-y-4">
        {ads.map((ad) => {
          const isExpired = ad.endDate && ad.endDate < now
          const isActive = ad.status === "active"
          
          return (
            <Card key={ad.id} className={isExpired ? "opacity-50" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{ad.title}</span>
                  <div className="flex gap-2">
                    <Badge variant={isActive ? "default" : "secondary"}>
                      {ad.status}
                    </Badge>
                    {isExpired && <Badge variant="destructive">EXPIRED</Badge>}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>ID:</strong> {ad.id}
                  </div>
                  <div>
                    <strong>Placement:</strong>{" "}
                    <Badge variant="outline" className="ml-2">
                      {ad.placement || "NOT SET"}
                    </Badge>
                  </div>
                  <div>
                    <strong>Status:</strong> {ad.status}
                  </div>
                  <div>
                    <strong>Ad Type:</strong> {ad.adType}
                  </div>
                  <div>
                    <strong>Start Date:</strong>{" "}
                    {ad.startDate ? new Date(ad.startDate).toLocaleString() : "N/A"}
                  </div>
                  <div>
                    <strong>End Date:</strong>{" "}
                    {ad.endDate ? new Date(ad.endDate).toLocaleString() : "N/A"}
                  </div>
                  <div className="col-span-2">
                    <strong>Company:</strong> {ad.company}
                  </div>
                  <div className="col-span-2">
                    <strong>Images:</strong> {ad.images?.length || 0} image(s)
                  </div>
                  
                  <div className="col-span-2 mt-4 p-3 bg-gray-50 rounded">
                    <strong>Will Show In:</strong>
                    <ul className="list-disc list-inside mt-2">
                      {isActive && !isExpired && ad.placement === "below-video" && (
                        <li className="text-green-600">✓ Below Video Section (Homepage)</li>
                      )}
                      {isActive && !isExpired && (ad.placement === "advertisement-section" || !ad.placement) && (
                        <li className="text-green-600">✓ Main Advertisement Section (Homepage)</li>
                      )}
                      {isActive && !isExpired && ad.placement === "sidebar" && (
                        <li className="text-green-600">✓ Sidebar (Service Detail Pages)</li>
                      )}
                      {!isActive && <li className="text-red-600">✗ Not active</li>}
                      {isExpired && <li className="text-red-600">✗ Expired</li>}
                      {isActive && !isExpired && ad.placement && !["below-video", "advertisement-section", "sidebar"].includes(ad.placement) && (
                        <li className="text-orange-600">⚠ Unknown placement: {ad.placement}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {ads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No advertisements found in database</p>
        </div>
      )}
    </div>
  )
}
