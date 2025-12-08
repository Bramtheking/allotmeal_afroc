"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User as FirebaseUser, onAuthStateChanged, signOut } from "firebase/auth"
import { getFirebaseAuth } from "./firebase"
import { getUserRole } from "./auth-utils"
import type { User } from "./types"

interface AuthContextType {
  user: FirebaseUser | null
  userRole: string
  userProfile: User | null
  loading: boolean
  logout: () => Promise<void>
  refreshUserRole: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: "user",
  userProfile: null,
  loading: true,
  logout: async () => {},
  refreshUserRole: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userRole, setUserRole] = useState<string>("user")
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUserRole = async () => {
    if (user) {
      const role = await getUserRole(user.uid)
      setUserRole(role)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    try {
      const auth = getFirebaseAuth()

      if (!auth) {
        setLoading(false)
        return
      }

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser)

        if (firebaseUser) {
          const role = await getUserRole(firebaseUser.uid)
          setUserRole(role)

          // Set user profile
          setUserProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "",
            photoURL: firebaseUser.photoURL || "",
            role: role as "user" | "marketing" | "admin",
            status: "active",
            createdAt: "",
            updatedAt: "",
          })
        } else {
          setUserRole("user")
          setUserProfile(null)
          // Clear any stored role selection when user logs out
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("selectedRole")
          }
        }

        setLoading(false)
      })

      return unsubscribe
    } catch (error) {
      console.error("Error initializing auth:", error)
      setLoading(false)
    }
  }, [user?.uid])

  const logout = async () => {
    if (typeof window === "undefined") return

    try {
      const auth = getFirebaseAuth()
      if (auth) {
        // Clear stored role selection
        sessionStorage.removeItem("selectedRole")
        await signOut(auth)
      }
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, userRole, userProfile, loading, logout, refreshUserRole }}>
      {children}
    </AuthContext.Provider>
  )
}
