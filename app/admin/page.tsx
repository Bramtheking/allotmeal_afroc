"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Mail, TrendingUp, ActivityIcon, BarChart3, Settings } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface DashboardStats {
  overview: {
    totalUsers: number
    totalServices: number
    totalContacts: number
    activeServices: number
  }
  userRoles: {
    user: number
    content_manager: number
    admin: number
  }
  serviceCategories: Record<string, number>
  serviceStatus: {
    active: number
    inactive: number
    pending: number
  }
  contactStatus: {
    new: number
    read: number
    replied: number
  }
}

interface AdminActivity {
  id: string
  type: string
  title: string
  timestamp: string
  user: string
}

export default function AdminDashboard() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<AdminActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user && token && (user.role === "admin" || user.role === "content_manager")) {
      fetchDashboardData()
    }
  }, [user, token])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activitiesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/admin/activities`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json()
        setActivities(activitiesData.activities)
      }
    } catch (err) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container py-32">
        <Alert>
          <AlertDescription>Please sign in to access the admin dashboard.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (user.role !== "admin" && user.role !== "content_manager") {
    return (
      <div className="container py-32">
        <Alert variant="destructive">
          <AlertDescription>You don't have permission to access this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.firstName}! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {user.role.replace("_", " ")}
          </Badge>
          <Button variant="outline" asChild>
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {stats && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.overview.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.userRoles.admin} admins, {stats.userRoles.content_manager} managers
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.overview.totalServices}</div>
                <p className="text-xs text-muted-foreground">{stats.overview.activeServices} active services</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.overview.totalContacts}</div>
                <p className="text-xs text-muted-foreground">{stats.contactStatus.new} new messages</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12%</div>
                <p className="text-xs text-muted-foreground">vs last month</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Service Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.serviceCategories).map(([category, count]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{category.replace("-", " ")}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ActivityIcon className="h-5 w-5" />
                      Service Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active</span>
                        <Badge className="bg-green-100 text-green-800">{stats.serviceStatus.active}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Inactive</span>
                        <Badge className="bg-red-100 text-red-800">{stats.serviceStatus.inactive}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pending</span>
                        <Badge className="bg-yellow-100 text-yellow-800">{stats.serviceStatus.pending}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Management</CardTitle>
                  <CardDescription>Manage all services across different categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" asChild>
                      <Link href="/admin/services">View All Services</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/admin/services/new">Add New Service</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/admin/services/pending">Review Pending</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.userRoles.user}</div>
                        <div className="text-sm text-muted-foreground">Regular Users</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{stats.userRoles.content_manager}</div>
                        <div className="text-sm text-muted-foreground">Content Managers</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{stats.userRoles.admin}</div>
                        <div className="text-sm text-muted-foreground">Administrators</div>
                      </div>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/admin/users">Manage Users</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest actions and events on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            by {activity.user} • {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {activity.type.replace("_", " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
