import { doc, getDoc, setDoc } from "firebase/firestore"
import { getFirebaseDb } from "./firebase"

export async function createUserProfile(
  uid: string,
  userData: {
    email: string
    displayName: string
    photoURL?: string
  },
) {
  try {
    const db = getFirebaseDb()
    if (!db) {
      throw new Error("Database not initialized")
    }

    // Check if user profile already exists
    const userDoc = await getDoc(doc(db, "users", uid))

    if (!userDoc.exists()) {
      // Create new user profile
      await setDoc(doc(db, "users", uid), {
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL || "",
        role: "user",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

export async function getUserRole(uid: string): Promise<string> {
  try {
    const db = getFirebaseDb()
    if (!db) {
      return "user"
    }

    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data()?.role || "user"
    }
    return "user"
  } catch (error) {
    console.error("Error getting user role:", error)
    return "user"
  }
}
