"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/login")
      return
    }

    // Regular users don't have dashboards - redirect to main page
    if (userRole === "user") {
      router.push("/")
      return
    }

    // For admin and marketing users, show role selector
    if (userRole === "admin" || userRole === "marketing") {
      // Import and show RoleSelector component
      import("@/components/role-selector").then(({ RoleSelector }) => {
        // This will be handled by the RoleSelector component
      })
    }
  }, [user, userRole, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Regular users get redirected, so this should only show for admin/marketing
  if (userRole === "user") {
    return null
  }

  // Show role selector for admin and marketing users
  const RoleSelector = require("@/components/role-selector").RoleSelector
  return <RoleSelector />
}
