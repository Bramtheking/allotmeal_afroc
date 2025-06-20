"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { collection, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service, Advertisement } from "@/lib/types"
import { Plus, Trash2, Eye, EyeOff, BarChart3, Package, Megaphone, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function MarketingDashboard() {
  const { user, userRole, loading: authLoading } = useAuth()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"services" | "advertisements">("services")

  useEffect(() => {
    if (authLoading) return

    if (!user || (userRole !== "marketing" && userRole !== "admin")) {
      router.push("/login")
      return
    }

    fetchData()
  }, [user, userRole, router, authLoading])

  const fetchData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const db = getFirebaseDb()
      if (!db) {
        throw new Error("Database not initialized")
      }

      // Fetch services created by this user
      const servicesQuery = query(
        collection(db, "services"),
        where("createdBy", "==", user.uid),
        orderBy("createdAt", "desc"),
      )
      const servicesSnapshot = await getDocs(servicesQuery)
      const servicesData: Service[] = []
      servicesSnapshot.forEach((doc) => {
        servicesData.push({ id: doc.id, ...doc.data() } as Service)
      })

      // Fetch advertisements created by this user
      const adsQuery = query(
        collection(db, "advertisements"),
        where("createdBy", "==", user.uid),
        orderBy("createdAt", "desc"),
      )
      const adsSnapshot = await getDocs(adsQuery)
      const adsData: Advertisement[] = []
      adsSnapshot.forEach((doc) => {
        adsData.push({ id: doc.id, ...doc.data() } as Advertisement)
      })

      setServices(servicesData)
      setAdvertisements(adsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to fetch data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateServiceStatus = async (serviceId: string, status: "active" | "suspended") => {
    try {
      const db = getFirebaseDb()
      if (!db) throw new Error("Database not initialized")

      await updateDoc(doc(db, "services", serviceId), {
        status,
        updatedAt: new Date().toISOString(),
      })

      setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, status } : s)))
      toast.success(`Service ${status === "active" ? "activated" : "suspended"}`)
    } catch (error) {
      console.error("Error updating service:", error)
      toast.error("Failed to update service status")
    }
  }

  const updateAdStatus = async (adId: string, status: "active" | "suspended") => {
    try {
      const db = getFirebaseDb()
      if (!db) throw new Error("Database not initialized")

      await updateDoc(doc(db, "advertisements", adId), {
        status,
        updatedAt: new Date().toISOString(),
      })

      setAdvertisements((prev) => prev.map((ad) => (ad.id === adId ? { ...ad, status } : ad)))
      toast.success(`Advertisement ${status === "active" ? "activated" : "suspended"}`)
    } catch (error) {
      console.error("Error updating advertisement:", error)
      toast.error("Failed to update advertisement status")
    }
  }

  const deleteService = async (serviceId: string) => {
    try {
      const db = getFirebaseDb()
      if (!db) throw new Error("Database not initialized")

      await deleteDoc(doc(db, "services", serviceId))
      setServices((prev) => prev.filter((s) => s.id !== serviceId))
      toast.success("Service deleted successfully")
    } catch (error) {
      console.error("Error deleting service:", error)
      toast.error("Failed to delete service")
    }
  }

  const deleteAdvertisement = async (adId: string) => {
    try {
      const db = getFirebaseDb()
      if (!db) throw new Error("Database not initialized")

      await deleteDoc(doc(db, "advertisements", adId))
      setAdvertisements((prev) => prev.filter((ad) => ad.id !== adId))
      toast.success("Advertisement deleted successfully")
    } catch (error) {
      console.error("Error deleting advertisement:", error)
      toast.error("Failed to delete advertisement")
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || (userRole !== "marketing" && userRole !== "admin")) {
    return <div>Access denied</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-yellow-950/30 dark:via-gray-950 dark:to-blue-950/30">
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Marketing Dashboard</h1>
            <p className="text-muted-foreground">Manage your services and advertisements</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.length}</div>
              <p className="text-xs text-muted-foreground">
                {services.filter((s) => s.status === "active").length} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Advertisements</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{advertisements.length}</div>
              <p className="text-xs text-muted-foreground">
                {advertisements.filter((ad) => ad.status === "active").length} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {services.reduce((total, service) => total + (service.views || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Service views</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button asChild>
            <Link href="/dashboard/marketing/services/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Service
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/marketing/advertisements/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Advertisement
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button variant={activeTab === "services" ? "default" : "outline"} onClick={() => setActiveTab("services")}>
            <Package className="h-4 w-4 mr-2" />
            Services ({services.length})
          </Button>
          <Button
            variant={activeTab === "advertisements" ? "default" : "outline"}
            onClick={() => setActiveTab("advertisements")}
          >
            <Megaphone className="h-4 w-4 mr-2" />
            Advertisements ({advertisements.length})
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading...</span>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Services Tab */}
            {activeTab === "services" && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Services</CardTitle>
                  <CardDescription>Manage your published services</CardDescription>
                </CardHeader>
                <CardContent>
                  {services.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No services yet</h3>
                      <p className="text-muted-foreground mb-4">Create your first service to get started</p>
                      <Button asChild>
                        <Link href="/dashboard/marketing/services/create">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Service
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {services.map((service) => (
                            <TableRow key={service.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {service.images && service.images.length > 0 ? (
                                    <img
                                      src={service.images[0] || "/placeholder.svg"}
                                      alt=""
                                      className="w-10 h-10 rounded object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                      <Package className="h-4 w-4" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-medium">{service.title}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-1">
                                      {service.description}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">{service.serviceType?.replace("-", " ")}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={service.status === "active" ? "default" : "destructive"}>
                                  {service.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{service.views || 0}</TableCell>
                              <TableCell>
                                {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : "Unknown"}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      updateServiceStatus(
                                        service.id!,
                                        service.status === "active" ? "suspended" : "active",
                                      )
                                    }
                                  >
                                    {service.status === "active" ? (
                                      <EyeOff className="h-3 w-3" />
                                    ) : (
                                      <Eye className="h-3 w-3" />
                                    )}
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button size="sm" variant="destructive">
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Service</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this service? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteService(service.id!)}>
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Advertisements Tab */}
            {activeTab === "advertisements" && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Advertisements</CardTitle>
                  <CardDescription>Manage your promotional campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  {advertisements.length === 0 ? (
                    <div className="text-center py-8">
                      <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No advertisements yet</h3>
                      <p className="text-muted-foreground mb-4">Create your first advertisement to get started</p>
                      <Button asChild>
                        <Link href="/dashboard/marketing/advertisements/create">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Advertisement
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Advertisement</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {advertisements.map((ad) => (
                            <TableRow key={ad.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {ad.images && ad.images.length > 0 ? (
                                    <img
                                      src={ad.images[0] || "/placeholder.svg"}
                                      alt=""
                                      className="w-10 h-10 rounded object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                      <Megaphone className="h-4 w-4" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-medium">{ad.title}</div>
                                    <div className="text-sm text-muted-foreground">{ad.company}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">{ad.adType}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={ad.status === "active" ? "default" : "destructive"}>{ad.status}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {ad.startDate && ad.endDate && (
                                    <>
                                      {new Date(ad.startDate).toLocaleDateString()} -{" "}
                                      {new Date(ad.endDate).toLocaleDateString()}
                                    </>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : "Unknown"}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      updateAdStatus(ad.id!, ad.status === "active" ? "suspended" : "active")
                                    }
                                  >
                                    {ad.status === "active" ? (
                                      <EyeOff className="h-3 w-3" />
                                    ) : (
                                      <Eye className="h-3 w-3" />
                                    )}
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button size="sm" variant="destructive">
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Advertisement</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this advertisement? This action cannot be
                                          undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteAdvertisement(ad.id!)}>
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
