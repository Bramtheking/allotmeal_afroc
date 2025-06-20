"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Shield, BarChart3, Package, Megaphone, Users, Settings, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getRoleInfo = () => {
    switch (userRole) {
      case "admin":
        return {
          title: "Admin Dashboard",
          description: "Manage users, content, and system settings",
          icon: Shield,
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-950/20",
          links: [
            {
              href: "/dashboard/admin/users",
              title: "User Management",
              description: "Manage user accounts and roles",
              icon: Users,
            },
            {
              href: "/dashboard/admin",
              title: "Admin Panel",
              description: "System administration tools",
              icon: Shield,
            },
          ],
        }
      case "marketing":
        return {
          title: "Marketing Dashboard",
          description: "Manage your services and advertisements",
          icon: BarChart3,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-950/20",
          links: [
            {
              href: "/dashboard/marketing",
              title: "Marketing Panel",
              description: "Manage services and ads",
              icon: BarChart3,
            },
            {
              href: "/dashboard/marketing/services/create",
              title: "Create Service",
              description: "Add new service listing",
              icon: Package,
            },
            {
              href: "/dashboard/marketing/advertisements/create",
              title: "Create Ad",
              description: "Create advertisement",
              icon: Megaphone,
            },
          ],
        }
      default:
        return {
          title: "User Dashboard",
          description: "Welcome to your personal dashboard",
          icon: User,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-950/20",
          links: [
            {
              href: "/profile",
              title: "Profile Settings",
              description: "Manage your account settings",
              icon: Settings,
            },
            { href: "/services", title: "Browse Services", description: "Explore available services", icon: Package },
          ],
        }
    }
  }

  const roleInfo = getRoleInfo()
  const RoleIcon = roleInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-yellow-950/30 dark:via-gray-950 dark:to-blue-950/30">
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-lg ${roleInfo.bgColor}`}>
              <RoleIcon className={`h-8 w-8 ${roleInfo.color}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{roleInfo.title}</h1>
              <p className="text-muted-foreground">{roleInfo.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Welcome back,</span>
              <span className="font-medium">{user.displayName || user.email}</span>
            </div>
            <Badge variant="secondary" className="capitalize">
              {userRole}
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roleInfo.links.map((link, index) => {
            const LinkIcon = link.icon
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <Link href={link.href}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <LinkIcon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{link.title}</CardTitle>
                      <CardDescription>{link.description}</CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" asChild>
                  <Link href="/services">
                    <Package className="mr-2 h-4 w-4" />
                    Browse Services
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Link>
                </Button>
                {(userRole === "marketing" || userRole === "admin") && (
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/marketing/services/create">
                      <Package className="mr-2 h-4 w-4" />
                      Create Service
                    </Link>
                  </Button>
                )}
                {userRole === "admin" && (
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/admin/users">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Users
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
