import { initializeApp, getApps } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getStorage, connectStorageEmulator } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
let app
let db
let auth
let storage

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  db = getFirestore(app)
  auth = getAuth(app)
  storage = getStorage(app)

  // Connect to emulators in development
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    try {
      connectFirestoreEmulator(db, "localhost", 8080)
      connectAuthEmulator(auth, "http://localhost:9099")
      connectStorageEmulator(storage, "localhost", 9199)
    } catch (error) {
      // Emulators already connected
    }
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
}

export { db, auth, storage }

export const getFirebaseDb = () => {
  if (typeof window === "undefined") {
    // Server-side: return null to avoid Firebase operations during build
    return null
  }
  return db
}

export const getFirebaseAuth = () => {
  if (typeof window === "undefined") {
    return null
  }
  return auth
}

export const getFirebaseStorage = () => {
  if (typeof window === "undefined") {
    return null
  }
  return storage
}
