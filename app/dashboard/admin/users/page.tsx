"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { User } from "@/lib/types"
import { Users, Shield, UserCheck, UserX, Trash2, ArrowLeft, Loader2, AlertTriangle } from "lucide-react"
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

export default function AdminUsersPage() {
  const { user, userRole, loading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    if (!user || userRole !== "admin") {
      router.push("/dashboard")
      return
    }

    fetchUsers()
  }, [user, userRole, router, authLoading])

  const fetchUsers = async () => {
    try {
      const db = getFirebaseDb()
      if (!db) {
        throw new Error("Database not initialized")
      }

      const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"))
      const usersSnapshot = await getDocs(usersQuery)
      const usersData: User[] = []

      usersSnapshot.forEach((doc) => {
        const userData = doc.data()
        usersData.push({
          uid: doc.id,
          email: userData.email || "",
          displayName: userData.displayName || userData.name || "",
          photoURL: userData.photoURL || "",
          role: userData.role || "user",
          status: userData.status || "active",
          createdAt: userData.createdAt || "",
          updatedAt: userData.updatedAt || "",
        })
      })

      setUsers(usersData)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    if (userId === user?.uid) {
      toast.error("You cannot change your own role")
      return
    }

    setUpdating(userId)
    try {
      const db = getFirebaseDb()
      if (!db) throw new Error("Database not initialized")

      await updateDoc(doc(db, "users", userId), {
        role: newRole,
        updatedAt: new Date().toISOString(),
      })

      setUsers((prev) =>
        prev.map((u) => (u.uid === userId ? { ...u, role: newRole as "user" | "marketing" | "admin" } : u)),
      )
      toast.success(`User role updated to ${newRole}`)
    } catch (error) {
      console.error("Error updating user role:", error)
      toast.error("Failed to update user role")
    } finally {
      setUpdating(null)
    }
  }

  const updateUserStatus = async (userId: string, newStatus: "active" | "suspended") => {
    if (userId === user?.uid) {
      toast.error("You cannot change your own status")
      return
    }

    setUpdating(userId)
    try {
      const db = getFirebaseDb()
      if (!db) throw new Error("Database not initialized")

      await updateDoc(doc(db, "users", userId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      })

      setUsers((prev) => prev.map((u) => (u.uid === userId ? { ...u, status: newStatus } : u)))
      toast.success(`User ${newStatus === "active" ? "activated" : "suspended"}`)
    } catch (error) {
      console.error("Error updating user status:", error)
      toast.error("Failed to update user status")
    } finally {
      setUpdating(null)
    }
  }

  const deleteUser = async (userId: string) => {
    if (userId === user?.uid) {
      toast.error("You cannot delete your own account")
      return
    }

    setUpdating(userId)
    try {
      const db = getFirebaseDb()
      if (!db) throw new Error("Database not initialized")

      await deleteDoc(doc(db, "users", userId))
      setUsers((prev) => prev.filter((u) => u.uid !== userId))
      toast.success("User deleted successfully")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    } finally {
      setUpdating(null)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || userRole !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-muted-foreground text-center mb-4">You don't have permission to access this page.</p>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-yellow-950/30 dark:via-gray-950 dark:to-blue-950/30">
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marketing</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "marketing").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.status === "suspended").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading users...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p className="text-muted-foreground">No users have been registered yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userData) => (
                      <TableRow key={userData.uid}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {userData.photoURL ? (
                              <img
                                src={userData.photoURL || "/placeholder.svg"}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <Users className="h-4 w-4" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">
                                {userData.displayName || "No name"}
                                {userData.uid === user?.uid && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    You
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{userData.email}</TableCell>
                        <TableCell>
                          <Select
                            value={userData.role}
                            onValueChange={(value) => updateUserRole(userData.uid, value)}
                            disabled={userData.uid === user?.uid || updating === userData.uid}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant={userData.status === "active" ? "default" : "destructive"}>
                            {userData.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Unknown"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateUserStatus(userData.uid, userData.status === "active" ? "suspended" : "active")
                              }
                              disabled={userData.uid === user?.uid || updating === userData.uid}
                            >
                              {updating === userData.uid ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : userData.status === "active" ? (
                                <UserX className="h-3 w-3" />
                              ) : (
                                <UserCheck className="h-3 w-3" />
                              )}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={userData.uid === user?.uid || updating === userData.uid}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this user? This action cannot be undone and will
                                    remove all their data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteUser(userData.uid)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete User
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
      </div>
    </div>
  )
}
