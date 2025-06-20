"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { collection, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { User, Service, Advertisement } from "@/lib/types"
import { Users, Package, Megaphone, BarChart3, UserCheck, Activity, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function AdminDashboard() {
  const { user, userRole } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalAdvertisements: 0,
    activeServices: 0,
    activeAdvertisements: 0,
    adminUsers: 0,
    marketingUsers: 0,
    regularUsers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [recentServices, setRecentServices] = useState<Service[]>([])
  const [recentAds, setRecentAds] = useState<Advertisement[]>([])

  useEffect(() => {
    if (!user || userRole !== "admin") {
      router.push("/login")
      return
    }
    fetchDashboardData()
  }, [user, userRole, router])

  const fetchDashboardData = async () => {
    try {
      const db = await getFirebaseDb()
      if (!db) return

      // Fetch users
      const usersSnapshot = await getDocs(collection(db, "users"))
      const users: User[] = []
      usersSnapshot.forEach((doc) => {
        users.push({ uid: doc.id, ...doc.data() } as User)
      })

      // Fetch services
      const servicesSnapshot = await getDocs(collection(db, "services"))
      const services: Service[] = []
      servicesSnapshot.forEach((doc) => {
        services.push({ id: doc.id, ...doc.data() } as Service)
      })

      // Fetch advertisements
      const adsSnapshot = await getDocs(collection(db, "advertisements"))
      const advertisements: Advertisement[] = []
      adsSnapshot.forEach((doc) => {
        advertisements.push({ id: doc.id, ...doc.data() } as Advertisement)
      })

      // Calculate stats
      const newStats = {
        totalUsers: users.length,
        totalServices: services.length,
        totalAdvertisements: advertisements.length,
        activeServices: services.filter((s) => s.status === "active").length,
        activeAdvertisements: advertisements.filter((ad) => ad.status === "active").length,
        adminUsers: users.filter((u) => u.role === "admin").length,
        marketingUsers: users.filter((u) => u.role === "marketing").length,
        regularUsers: users.filter((u) => u.role === "user").length,
      }

      setStats(newStats)

      // Set recent data (last 5)
      setRecentUsers(users.slice(0, 5))
      setRecentServices(services.slice(0, 5))
      setRecentAds(advertisements.slice(0, 5))
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to fetch dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (!user || userRole !== "admin") {
    return <div>Access denied</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-red-950/30 dark:via-gray-950 dark:to-blue-950/30">
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management</p>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading dashboard...</span>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.regularUsers} regular, {stats.marketingUsers} marketing, {stats.adminUsers} admin
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalServices}</div>
                  <p className="text-xs text-muted-foreground">{stats.activeServices} active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Advertisements</CardTitle>
                  <Megaphone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAdvertisements}</div>
                  <p className="text-xs text-muted-foreground">{stats.activeAdvertisements} active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>Manage user roles and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/admin/users">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Manage Users
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Content Management
                  </CardTitle>
                  <CardDescription>Oversee all services and content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard/marketing">View as Marketing</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics
                  </CardTitle>
                  <CardDescription>View system analytics and reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentUsers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No users yet</p>
                  ) : (
                    <div className="space-y-4">
                      {recentUsers.map((user) => (
                        <div key={user.uid} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            {user.photoURL ? (
                              <img src={user.photoURL || "/placeholder.svg"} alt="" className="w-8 h-8 rounded-full" />
                            ) : (
                              <span className="text-sm font-medium">
                                {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{user.displayName || "No name"}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium capitalize">{user.role}</div>
                            <div className="text-xs text-muted-foreground">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Services</CardTitle>
                  <CardDescription>Latest service submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentServices.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No services yet</p>
                  ) : (
                    <div className="space-y-4">
                      {recentServices.map((service) => (
                        <div key={service.id} className="flex items-center gap-3">
                          {service.images && service.images.length > 0 ? (
                            <img
                              src={service.images[0] || "/placeholder.svg"}
                              alt=""
                              className="w-8 h-8 rounded object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                              <Package className="h-4 w-4" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium line-clamp-1">{service.title}</div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {service.serviceType?.replace("-", " ")}
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-sm font-medium ${service.status === "active" ? "text-green-600" : "text-red-600"}`}
                            >
                              {service.status}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : "Unknown"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
