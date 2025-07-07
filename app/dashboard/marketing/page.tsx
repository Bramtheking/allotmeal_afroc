"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { collection, getDocs, query, where, orderBy, deleteDoc, doc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import type { Service, Advertisement } from "@/lib/types"
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Building2, Play } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { getVideoThumbnail, getYouTubeThumbnail } from "@/lib/cloudinary"

export default function MarketingDashboard() {
  const { user } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      console.log("User authorized, fetching data...")
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const db = await getFirebaseDb()
      if (!db) return

      console.log("Fetching data for user:", user?.uid)

      // Fetch services
      const servicesQuery =
        user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
          ? query(collection(db, "services"), orderBy("createdAt", "desc"))
          : query(collection(db, "services"), where("userId", "==", user?.uid), orderBy("createdAt", "desc"))

      const servicesSnapshot = await getDocs(servicesQuery)
      const servicesData = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[]

      console.log("Services fetched:", servicesData.length)
      setServices(servicesData)

      // Fetch advertisements
      const adsQuery =
        user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
          ? query(collection(db, "advertisements"), orderBy("createdAt", "desc"))
          : query(collection(db, "advertisements"), where("userId", "==", user?.uid), orderBy("createdAt", "desc"))

      const adsSnapshot = await getDocs(adsQuery)
      const adsData = adsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Advertisement[]

      console.log("Advertisements fetched:", adsData.length)
      setAdvertisements(adsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      const db = await getFirebaseDb()
      if (!db) return

      await deleteDoc(doc(db, "services", serviceId))
      setServices(services.filter((service) => service.id !== serviceId))
      toast.success("Service deleted successfully")
    } catch (error) {
      console.error("Error deleting service:", error)
      toast.error("Failed to delete service")
    }
  }

  const handleDeleteAdvertisement = async (adId: string) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return

    try {
      const db = await getFirebaseDb()
      if (!db) return

      await deleteDoc(doc(db, "advertisements", adId))
      setAdvertisements(advertisements.filter((ad) => ad.id !== adId))
      toast.success("Advertisement deleted successfully")
    } catch (error) {
      console.error("Error deleting advertisement:", error)
      toast.error("Failed to delete advertisement")
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

  const hasVideoContent = (service: Service) => {
    return (service.videos && service.videos.length > 0) || (service.youtubeLinks && service.youtubeLinks.length > 0)
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Marketing Dashboard</h1>
          <p className="text-muted-foreground">Manage your services and advertisements</p>
        </div>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
          <TabsTrigger value="advertisements">Advertisements ({advertisements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Services</h2>
            <Button asChild>
              <Link href="/dashboard/marketing/services/create">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Link>
            </Button>
          </div>

          {services.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No services yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first service to get started</p>
                  <Button asChild>
                    <Link href="/dashboard/marketing/services/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Service
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={getServiceThumbnail(service) || "/placeholder.svg"}
                          alt={service.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=100&width=100"
                          }}
                        />
                        {hasVideoContent(service) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold line-clamp-1">{service.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <Badge variant="outline" className="capitalize">
                                {service.serviceType?.replace("-", " ")}
                              </Badge>
                              {service.company && (
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  <span>{service.company}</span>
                                </div>
                              )}
                              {service.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{service.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
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
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{service.description}</p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Created{" "}
                              {service.createdAt
                                ? new Date(service.createdAt.seconds * 1000).toLocaleDateString()
                                : "Unknown"}
                            </span>
                          </div>
                          {service.price && <span className="font-semibold text-primary">{service.price}</span>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="advertisements" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Advertisements</h2>
            <Button asChild>
              <Link href="/dashboard/marketing/advertisements/create">
                <Plus className="h-4 w-4 mr-2" />
                Add Advertisement
              </Link>
            </Button>
          </div>

          {advertisements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No advertisements yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first advertisement to get started</p>
                  <Button asChild>
                    <Link href="/dashboard/marketing/advertisements/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Advertisement
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Advertisement</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advertisements.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {ad.images && ad.images.length > 0 && (
                            <img
                              src={ad.images[0] || "/placeholder.svg"}
                              alt={ad.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium line-clamp-1">{ad.title}</div>
                            {ad.company && <div className="text-sm text-muted-foreground">{ad.company}</div>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {ad.adType || "Standard"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ad.status === "active" ? "default" : "secondary"}>{ad.status || "Draft"}</Badge>
                      </TableCell>
                      <TableCell>{ad.price || "N/A"}</TableCell>
                      <TableCell>
                        {ad.createdAt ? new Date(ad.createdAt.seconds * 1000).toLocaleDateString() : "Unknown"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/advertisements/${ad.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAdvertisement(ad.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
