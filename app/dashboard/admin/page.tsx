"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { collection, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { User, Service, Advertisement } from "@/lib/types"
import {
  Users,
  Package,
  Megaphone,
  BarChart3,
  UserCheck,
  Activity,
  ArrowLeft,
  Loader2,
  Eye,
  TrendingUp,
  Calendar,
  Mail,
  Copy,
  Smartphone,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { getManualVisitorStats } from "@/lib/manual-visitor-counter"

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
  const [visitorStats, setVisitorStats] = useState({
    totalViews: 0,
    todayViews: 0,
    thisWeekViews: 0,
    thisMonthViews: 0,
    thisYearViews: 0,
    uniqueVisitorsOnly: true,
  })
  const [loading, setLoading] = useState(true)
  const [firebaseAvailable, setFirebaseAvailable] = useState(true)
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [recentServices, setRecentServices] = useState<Service[]>([])
  const [recentAds, setRecentAds] = useState<Advertisement[]>([])
  const [newsletterStats, setNewsletterStats] = useState({
    totalSubscribers: 0,
    recentSubscribers: [] as Array<{email: string, subscribeDate: string}>
  })

  useEffect(() => {
    if (!user || userRole !== "admin") {
      router.push("/login")
      return
    }
    fetchDashboardData()
  }, [user, userRole, router])

  const fetchDashboardData = async () => {
    try {
      // Load manual visitor stats first (works regardless of Firebase)
      const manualStats = getManualVisitorStats()
      setVisitorStats(manualStats)
      
      const db = await getFirebaseDb()
      if (!db) {
        // Show a message that Firebase is not configured, but keep visitor stats
        console.log("[Admin Dashboard] Firebase not configured - showing visitor stats only")
        setFirebaseAvailable(false)
        setLoading(false)
        return
      }

      setFirebaseAvailable(true)

      const [usersSnapshot, servicesSnapshot, adsSnapshot, newsletterSnapshot] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "services")),
        getDocs(collection(db, "advertisements")),
        getDocs(collection(db, "newsletter_subscribers")),
      ])

      // Get manual visitor stats from localStorage
      const visitors = getManualVisitorStats()

      const users: User[] = []
      usersSnapshot.forEach((doc) => {
        users.push({ uid: doc.id, ...doc.data() } as User)
      })

      const services: Service[] = []
      servicesSnapshot.forEach((doc) => {
        services.push({ id: doc.id, ...doc.data() } as Service)
      })

      const advertisements: Advertisement[] = []
      adsSnapshot.forEach((doc) => {
        advertisements.push({ id: doc.id, ...doc.data() } as Advertisement)
      })

      const newsletter: Array<{email: string, subscribeDate: string}> = []
      newsletterSnapshot.forEach((doc) => {
        const data = doc.data()
        newsletter.push({ 
          email: data.email, 
          subscribeDate: data.subscribeDate 
        })
      })

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
      setVisitorStats(visitors)
      console.log("[Admin Dashboard] Manual visitor stats:", visitors)

      setRecentUsers(users.slice(0, 5))
      setRecentServices(services.slice(0, 5))
      setRecentAds(advertisements.slice(0, 5))
      setNewsletterStats({
        totalSubscribers: newsletter.length,
        recentSubscribers: newsletter.sort((a, b) => new Date(b.subscribeDate).getTime() - new Date(a.subscribeDate).getTime()).slice(0, 5)
      })
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{visitorStats.totalViews}</div>
                  <p className="text-xs text-muted-foreground">Unique visitors only (no reloads)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Views</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{visitorStats.todayViews}</div>
                  <p className="text-xs text-muted-foreground">Unique visitors today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Week</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{visitorStats.thisWeekViews}</div>
                  <p className="text-xs text-muted-foreground">Unique visitors this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{visitorStats.thisMonthViews}</div>
                  <p className="text-xs text-muted-foreground">Unique visitors this month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{newsletterStats.totalSubscribers}</div>
                  <p className="text-xs text-muted-foreground">
                    {!firebaseAvailable ?
                      "Firebase not configured" :
                      "Active email subscriptions"
                    }
                  </p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    <Smartphone className="h-5 w-5" />
                    M-Pesa Payments
                  </CardTitle>
                  <CardDescription>Configure payment settings & view transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/dashboard/admin/mpesa">
                        <Smartphone className="h-4 w-4 mr-2" />
                        M-Pesa Settings
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard/admin/mpesa/transactions">
                        View Transactions
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Job Applications
                  </CardTitle>
                  <CardDescription>View and manage job applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/admin/applications">
                      <Package className="h-4 w-4 mr-2" />
                      View Applications
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Featured Video
                  </CardTitle>
                  <CardDescription>Manage homepage featured video</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/admin/video">
                      <Megaphone className="h-4 w-4 mr-2" />
                      Manage Video
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
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/dashboard/marketing">View as Marketing</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Website Analytics
                  </CardTitle>
                  <CardDescription>Manual visitor tracking system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Weekly average:</span>
                        <span className="font-medium">{Math.round(visitorStats.thisWeekViews / 7)} views/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly growth:</span>
                        <span className="font-medium text-green-600">
                          +{Math.round((visitorStats.thisMonthViews / visitorStats.totalViews) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Newsletter Subscribers</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={async () => {
                        const emails = newsletterStats.recentSubscribers.map(sub => sub.email).join(", ")
                        try {
                          await navigator.clipboard.writeText(emails)
                          toast.success("Email addresses copied to clipboard!")
                        } catch (error) {
                          toast.error("Failed to copy emails")
                        }
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy All
                    </Button>
                  </CardTitle>
                  <CardDescription>Recent email subscriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  {newsletterStats.totalSubscribers === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No subscribers yet</p>
                  ) : (
                    <div className="space-y-3">
                      {newsletterStats.recentSubscribers.map((subscriber, index) => (
                        <div key={index} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Mail className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{subscriber.email}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(subscriber.email)
                                  toast.success("Email copied!")
                                } catch (error) {
                                  toast.error("Failed to copy email")
                                }
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <div className="text-xs text-muted-foreground">
                              {new Date(subscriber.subscribeDate).toLocaleDateString()}
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
