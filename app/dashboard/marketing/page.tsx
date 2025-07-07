"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service, Advertisement } from "@/lib/types"
import { Plus, Eye, Edit, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { getVideoThumbnail, getYouTubeThumbnail } from "@/lib/cloudinary"

export default function MarketingDashboard() {
  const { user, userRole } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingService, setDeletingService] = useState<string | null>(null)
  const [deletingAd, setDeletingAd] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        console.log("User authorized, fetching data...")
        console.log("Fetching data for user:", user.uid)

        const db = await getFirebaseDb()
        if (!db) throw new Error("Database not available")

        // Fetch services
        const servicesQuery =
          userRole === "admin"
            ? collection(db, "services")
            : query(collection(db, "services"), where("createdBy", "==", user.uid))

        const servicesSnapshot = await getDocs(servicesQuery)
        const servicesData = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[]

        console.log("Services fetched:", servicesData.length)
        setServices(servicesData)

        // Fetch advertisements
        const adsQuery =
          userRole === "admin"
            ? collection(db, "advertisements")
            : query(collection(db, "advertisements"), where("createdBy", "==", user.uid))

        const adsSnapshot = await getDocs(adsQuery)
        const adsData = adsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Advertisement[]

        console.log("Advertisements fetched:", adsData.length)
        setAdvertisements(adsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, userRole])

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    setDeletingService(serviceId)
    try {
      const db = await getFirebaseDb()
      if (!db) throw new Error("Database not available")

      await deleteDoc(doc(db, "services", serviceId))
      setServices((prev) => prev.filter((service) => service.id !== serviceId))
      toast.success("Service deleted successfully")
    } catch (error) {
      console.error("Error deleting service:", error)
      toast.error("Failed to delete service")
    } finally {
      setDeletingService(null)
    }
  }

  const handleDeleteAdvertisement = async (adId: string) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return

    setDeletingAd(adId)
    try {
      const db = await getFirebaseDb()
      if (!db) throw new Error("Database not available")

      await deleteDoc(doc(db, "advertisements", adId))
      setAdvertisements((prev) => prev.filter((ad) => ad.id !== adId))
      toast.success("Advertisement deleted successfully")
    } catch (error) {
      console.error("Error deleting advertisement:", error)
      toast.error("Failed to delete advertisement")
    } finally {
      setDeletingAd(null)
    }
  }

  const getServiceThumbnail = (service: Service) => {
    // Priority: images > video thumbnails > youtube thumbnails > placeholder
    if (service.images && service.images.length > 0) {
      return service.images[0]
    }

    if (service.videos && service.videos.length > 0) {
      const thumbnail = getVideoThumbnail(service.videos[0])
      if (thumbnail) return thumbnail
    }

    if (service.youtubeLinks && service.youtubeLinks.length > 0) {
      const thumbnail = getYouTubeThumbnail(service.youtubeLinks[0])
      if (thumbnail) return thumbnail
    }

    return "/placeholder.svg?height=100&width=100"
  }

  const getAdvertisementThumbnail = (ad: Advertisement) => {
    if (ad.images && ad.images.length > 0) {
      return ad.images[0]
    }
    return "/placeholder.svg?height=100&width=100"
  }

  if (!user || (userRole !== "marketing" && userRole !== "admin")) {
    return <div>Access denied</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-yellow-950/30 dark:via-gray-950 dark:to-blue-950/30">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Marketing Dashboard</h1>
            <p className="text-muted-foreground">Manage your services and advertisements</p>
          </div>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
            <TabsTrigger value="advertisements">Advertisements ({advertisements.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Services</h2>
              <Button asChild>
                <Link href="/dashboard/marketing/services/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Service
                </Link>
              </Button>
            </div>

            {services.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No services found</p>
                  <Button asChild>
                    <Link href="/dashboard/marketing/services/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Service
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Your Services</CardTitle>
                  <CardDescription>Manage your service listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>
                            <div className="relative w-16 h-16">
                              <img
                                src={getServiceThumbnail(service) || "/placeholder.svg"}
                                alt={service.title}
                                className="w-full h-full object-cover rounded-md"
                              />
                              {service.videos && service.videos.length > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                                  <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
                                    <div className="w-0 h-0 border-l-[6px] border-l-black border-y-[4px] border-y-transparent ml-0.5"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{service.title}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{service.serviceType?.replace("-", " ") || "Unknown"}</Badge>
                          </TableCell>
                          <TableCell>{service.company}</TableCell>
                          <TableCell>
                            <Badge variant={service.status === "active" ? "default" : "secondary"}>
                              {service.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{service.views || 0}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/services/${service.serviceType}/${service.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/dashboard/marketing/services/edit/${service.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteService(service.id)}
                                disabled={deletingService === service.id}
                              >
                                {deletingService === service.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="advertisements" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Advertisements</h2>
              <Button asChild>
                <Link href="/dashboard/marketing/advertisements/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Advertisement
                </Link>
              </Button>
            </div>

            {advertisements.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No advertisements found</p>
                  <Button asChild>
                    <Link href="/dashboard/marketing/advertisements/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Advertisement
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Your Advertisements</CardTitle>
                  <CardDescription>Manage your advertisement listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {advertisements.map((ad) => (
                        <TableRow key={ad.id}>
                          <TableCell>
                            <img
                              src={getAdvertisementThumbnail(ad) || "/placeholder.svg"}
                              alt={ad.title}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{ad.title}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{ad.adType?.replace("-", " ") || "Unknown"}</Badge>
                          </TableCell>
                          <TableCell>{ad.company}</TableCell>
                          <TableCell>
                            <Badge variant={ad.status === "active" ? "default" : "secondary"}>{ad.status}</Badge>
                          </TableCell>
                          <TableCell>{ad.views || 0}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/advertisements/${ad.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteAdvertisement(ad.id)}
                                disabled={deletingAd === ad.id}
                              >
                                {deletingAd === ad.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
