"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, BarChart3, Home } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export function RoleSelector() {
  const { user, userRole } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRoleSelection = async (selectedRole: string) => {
    if (!user) return

    setLoading(true)

    try {
      // Redirect based on selected role
      switch (selectedRole) {
        case "main":
          router.push("/")
          break
        case "marketing":
          router.push("/dashboard/marketing")
          break
        case "admin":
          router.push("/dashboard/admin")
          break
        default:
          router.push("/")
      }

      toast.success(`Redirected to ${selectedRole === "main" ? "main page" : selectedRole + " dashboard"}`)
    } catch (error) {
      console.error("Error with role selection:", error)
      toast.error("Failed to redirect")
    } finally {
      setLoading(false)
    }
  }

  const availableRoles = () => {
    switch (userRole) {
      case "admin":
        return ["admin", "marketing", "main"]
      case "marketing":
        return ["marketing", "main"]
      default:
        // Regular users go directly to main page
        router.push("/")
        return []
    }
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "main":
        return {
          title: "Main Page",
          description: "Browse services and explore the platform",
          icon: <Home className="h-8 w-8" />,
          color: "bg-green-500",
        }
      case "marketing":
        return {
          title: "Marketing Dashboard",
          description: "Manage services, advertisements, and content",
          icon: <BarChart3 className="h-8 w-8" />,
          color: "bg-yellow-500",
        }
      case "admin":
        return {
          title: "Admin Dashboard",
          description: "Full system control and user management",
          icon: <Shield className="h-8 w-8" />,
          color: "bg-red-500",
        }
      default:
        return {
          title: "Dashboard",
          description: "Access your dashboard",
          icon: <Home className="h-8 w-8" />,
          color: "bg-gray-500",
        }
    }
  }

  const roles = availableRoles()

  if (roles.length === 0) {
    // This handles regular users - they get redirected automatically
    return null
  }

  if (roles.length === 1) {
    // Auto-redirect if user only has one option
    handleRoleSelection(roles[0])
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-yellow-950/30 dark:via-gray-950 dark:to-blue-950/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
              Choose Your Access Level
            </span>
          </h1>
          <p className="text-muted-foreground">Select how you want to access the platform</p>
          <Badge variant="outline" className="mt-2">
            Your Role: {userRole}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const roleInfo = getRoleInfo(role)
            return (
              <Card key={role} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 ${roleInfo.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}
                  >
                    {roleInfo.icon}
                  </div>
                  <CardTitle>{roleInfo.title}</CardTitle>
                  <CardDescription>{roleInfo.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700"
                    onClick={() => handleRoleSelection(role)}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : role === "main" ? "Go to Main Page" : "Enter Dashboard"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
