"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Eye, Play, MapPin, Calendar, DollarSign, Users, TrendingUp, Star } from "lucide-react"
import Link from "next/link"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import type { Service, Advertisement } from "@/lib/types"
import { toast } from "sonner"
import { getVideoThumbnail, getYouTubeThumbnail } from "@/lib/cloudinary"

export default function MarketingDashboard() {
  const { user } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return

    try {
      console.log("User authorized, fetching data...")
      console.log("Fetching data for user:", user.uid)

      const db = await getFirebaseDb()
      if (!db) {
        console.error("Database not available")
        return
      }

      // Fetch ALL services - both admin and marketing can see all services
      const servicesQuery = collection(db, "services")

      const servicesSnapshot = await getDocs(servicesQuery)
      const servicesData = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[]

      console.log("Services fetched:", servicesData.length)
      setServices(servicesData)

      // Fetch ALL advertisements - both admin and marketing can see all advertisements
      const advertisementsQuery = collection(db, "advertisements")

      const advertisementsSnapshot = await getDocs(advertisementsQuery)
      const advertisementsData = advertisementsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Advertisement[]

      console.log("Advertisements fetched:", advertisementsData.length)
      setAdvertisements(advertisementsData)
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

  const handleDeleteAdvertisement = async (advertisementId: string) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return

    try {
      const db = await getFirebaseDb()
      if (!db) return

      await deleteDoc(doc(db, "advertisements", advertisementId))
      setAdvertisements(advertisements.filter((ad) => ad.id !== advertisementId))
      toast.success("Advertisement deleted successfully")
    } catch (error) {
      console.error("Error deleting advertisement:", error)
      toast.error("Failed to delete advertisement")
    }
  }

  const getServiceThumbnail = (service: Service) => {
    // Priority: images → video thumbnails → YouTube thumbnails → placeholder
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

    return "/placeholder.svg?height=200&width=300"
  }

  const getAdvertisementThumbnail = (advertisement: Advertisement) => {
    // Priority: images → video thumbnails → YouTube thumbnails → placeholder
    if (advertisement.images && advertisement.images.length > 0) {
      return advertisement.images[0]
    }

    if (advertisement.videos && advertisement.videos.length > 0) {
      const thumbnail = getVideoThumbnail(advertisement.videos[0])
      if (thumbnail) return thumbnail
    }

    if (advertisement.youtubeLinks && advertisement.youtubeLinks.length > 0) {
      const thumbnail = getYouTubeThumbnail(advertisement.youtubeLinks[0])
      if (thumbnail) return thumbnail
    }

    return "/placeholder.svg?height=200&width=300"
  }

  const hasVideoContent = (item: Service | Advertisement) => {
    return (item.videos && item.videos.length > 0) || (item.youtubeLinks && item.youtubeLinks.length > 0)
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"

    try {
      let date: Date
      if (timestamp.toDate) {
        // Firestore Timestamp
        date = timestamp.toDate()
      } else if (timestamp.seconds) {
        // Firestore Timestamp object
        date = new Date(timestamp.seconds * 1000)
      } else {
        // Regular date string or number
        date = new Date(timestamp)
      }

      return date.toLocaleDateString()
    } catch (error) {
      console.error("Error formatting date:", error)
      return "N/A"
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-muted animate-pulse" />
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse mb-4 w-2/3" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </CardContent>
            </Card>
          ))}
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
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/dashboard/marketing/services/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/marketing/advertisements/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Advertisement
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advertisements</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advertisements.length}</div>
            <p className="text-xs text-muted-foreground">Active campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.filter((s) => s.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently visible</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.reduce((total, service) => total + (service.views || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all services</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
          <TabsTrigger value="advertisements">Advertisements ({advertisements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          {services.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No services yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first service to get started</p>
                  <Button asChild>
                    <Link href="/dashboard/marketing/services/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Service
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getServiceThumbnail(service) || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=200&width=300"
                      }}
                    />
                    {hasVideoContent(service) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="bg-white/90 rounded-full p-3">
                          <Play className="h-6 w-6 text-gray-800" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge variant={service.status === "active" ? "default" : "secondary"}>{service.status}</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-white/90">
                        {service.serviceType}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{service.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(service.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {service.views || 0} views
                      </div>
                    </div>
                    {service.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {service.location}
                      </div>
                    )}
                    {service.price && (
                      <div className="flex items-center text-sm font-semibold text-primary">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {service.price}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild className="flex-1 bg-transparent">
                        <Link href={`/services/${service.serviceType}/${service.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild className="flex-1 bg-transparent">
                        <Link href={`/dashboard/marketing/services/edit/${service.id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteService(service.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="advertisements" className="space-y-6">
          {advertisements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No advertisements yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first advertisement to get started</p>
                  <Button asChild>
                    <Link href="/dashboard/marketing/advertisements/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Advertisement
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advertisements.map((advertisement) => (
                <Card key={advertisement.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getAdvertisementThumbnail(advertisement) || "/placeholder.svg"}
                      alt={advertisement.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=200&width=300"
                      }}
                    />
                    {hasVideoContent(advertisement) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="bg-white/90 rounded-full p-3">
                          <Play className="h-6 w-6 text-gray-800" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge variant={advertisement.status === "active" ? "default" : "secondary"}>
                        {advertisement.status}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{advertisement.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{advertisement.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(advertisement.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {advertisement.views || 0} views
                      </div>
                    </div>
                    {advertisement.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {advertisement.location}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild className="flex-1 bg-transparent">
                        <Link href={`/advertisements/${advertisement.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteAdvertisement(advertisement.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
