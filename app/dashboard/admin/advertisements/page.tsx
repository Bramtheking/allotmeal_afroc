"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Advertisement } from "@/lib/types"
import { Loader2, MapPin, Calendar, Eye, Trash2, Edit } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function AdvertisementsManagementPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchAdvertisements()
  }, [])

  const fetchAdvertisements = async () => {
    try {
      const db = await getFirebaseDb()
      if (!db) {
        toast.error("Database not available")
        return
      }

      const querySnapshot = await getDocs(collection(db, "advertisements"))
      const ads: Advertisement[] = []

      querySnapshot.forEach((doc) => {
        ads.push({ id: doc.id, ...doc.data() } as Advertisement)
      })

      // Sort by creation date, newest first
      ads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setAdvertisements(ads)
    } catch (error) {
      console.error("Error fetching advertisements:", error)
      toast.error("Failed to fetch advertisements")
    } finally {
      setLoading(false)
    }
  }

  const handlePlacementChange = async (adId: string, newPlacement: string) => {
    setUpdating(adId)
    try {
      const db = await getFirebaseDb()
      if (!db) {
        toast.error("Database not available")
        return
      }

      await updateDoc(doc(db, "advertisements", adId), {
        placement: newPlacement,
        updatedAt: new Date().toISOString(),
      })

      setAdvertisements((prev) =>
        prev.map((ad) => (ad.id === adId ? { ...ad, placement: newPlacement } : ad))
      )

      toast.success("Placement updated successfully")
    } catch (error) {
      console.error("Error updating placement:", error)
      toast.error("Failed to update placement")
    } finally {
      setUpdating(null)
    }
  }

  const handleStatusChange = async (adId: string, newStatus: "active" | "suspended" | "pending") => {
    setUpdating(adId)
    try {
      const db = await getFirebaseDb()
      if (!db) {
        toast.error("Database not available")
        return
      }

      await updateDoc(doc(db, "advertisements", adId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      })

      setAdvertisements((prev) =>
        prev.map((ad) => (ad.id === adId ? { ...ad, status: newStatus } : ad))
      )

      toast.success("Status updated successfully")
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (adId: string) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return

    setUpdating(adId)
    try {
      const db = await getFirebaseDb()
      if (!db) {
        toast.error("Database not available")
        return
      }

      await deleteDoc(doc(db, "advertisements", adId))
      setAdvertisements((prev) => prev.filter((ad) => ad.id !== adId))
      toast.success("Advertisement deleted successfully")
    } catch (error) {
      console.error("Error deleting advertisement:", error)
      toast.error("Failed to delete advertisement")
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Advertisements</h1>
        <p className="text-muted-foreground">
          Control advertisement placements and status across the website
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Ads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advertisements.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {advertisements.filter((ad) => ad.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {advertisements.filter((ad) => ad.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {advertisements.filter((ad) => ad.status === "suspended").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advertisements List */}
      <div className="space-y-4">
        {advertisements.map((ad) => (
          <Card key={ad.id} className={updating === ad.id ? "opacity-50" : ""}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                {ad.images && ad.images.length > 0 && (
                  <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={ad.images[0]}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{ad.title}</h3>
                    {ad.company && (
                      <p className="text-sm text-muted-foreground">{ad.company}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant={ad.status === "active" ? "default" : ad.status === "pending" ? "secondary" : "destructive"}>
                      {ad.status}
                    </Badge>
                    <Badge variant="outline">{ad.adType}</Badge>
                    {ad.placement && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {ad.placement}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {ad.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {ad.location}
                      </div>
                    )}
                    {ad.endDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Expires: {new Date(ad.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 md:w-64">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Placement</label>
                    <Select
                      value={ad.placement || "advertisement-section"}
                      onValueChange={(value) => handlePlacementChange(ad.id!, value)}
                      disabled={updating === ad.id}
                    >
                      <SelectTrigger className="text-gray-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homepage" className="text-gray-900">Homepage (Below Video)</SelectItem>
                        <SelectItem value="services" className="text-gray-900">Featured Advertisements</SelectItem>
                        <SelectItem value="sidebar" className="text-gray-900">Sidebar</SelectItem>
                        <SelectItem value="footer" className="text-gray-900">Footer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={ad.status}
                      onValueChange={(value) => handleStatusChange(ad.id!, value as any)}
                      disabled={updating === ad.id}
                    >
                      <SelectTrigger className="text-gray-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active" className="text-gray-900">Active</SelectItem>
                        <SelectItem value="pending" className="text-gray-900">Pending</SelectItem>
                        <SelectItem value="suspended" className="text-gray-900">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/advertisements/${ad.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(ad.id!)}
                      disabled={updating === ad.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {advertisements.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No advertisements found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
