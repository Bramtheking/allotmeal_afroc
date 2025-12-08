import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"
import { getStorage, type FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
let app: FirebaseApp | undefined
let db: Firestore | null = null
let auth: Auth | null = null
let storage: FirebaseStorage | null = null

const isFirebaseConfigValid = () => {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  )
}

try {
  if (!isFirebaseConfigValid()) {
    console.warn("Firebase configuration incomplete - using mock data fallback")
    console.warn("Config check:", {
      hasApiKey: !!firebaseConfig.apiKey,
      hasAuthDomain: !!firebaseConfig.authDomain,
      hasProjectId: !!firebaseConfig.projectId,
      hasStorageBucket: !!firebaseConfig.storageBucket,
      hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
      hasAppId: !!firebaseConfig.appId,
    })
    throw new Error("Firebase configuration incomplete")
  }

  if (getApps().length === 0) {
    console.log("Initializing Firebase app...")
    app = initializeApp(firebaseConfig)
  } else {
    console.log("Using existing Firebase app")
    app = getApps()[0]
  }

  db = getFirestore(app)
  auth = getAuth(app)
  storage = getStorage(app)

  console.log("Firebase initialized successfully", { projectId: firebaseConfig.projectId })
} catch (error) {
  console.error("Firebase initialization error:", error)
  console.error("Error details:", error instanceof Error ? error.message : "Unknown error")
  // Set all Firebase services to null to ensure fallback to mock data
  db = null
  auth = null
  storage = null
}

export { db, auth, storage }

export const getFirebaseDb = () => {
  if (typeof window === "undefined") {
    console.log("Server-side rendering - using mock data")
    return null
  }

  if (!db) {
    console.log("Firebase database not available - check environment variables or using mock data fallback")
    return null
  }

  return db
}

// Async version that waits for Firebase to be ready (useful for mobile)
export const waitForFirebaseDb = async (maxWaitMs = 10000): Promise<Firestore | null> => {
  if (typeof window === "undefined") {
    return null
  }

  // If already initialized, return immediately
  if (db) {
    return db
  }

  // Wait for Firebase to initialize (useful on slower mobile connections)
  const startTime = Date.now()
  let lastLogTime = 0
  while (!db && Date.now() - startTime < maxWaitMs) {
    // Log progress every 2 seconds
    if (Date.now() - lastLogTime > 2000) {
      console.log(`Waiting for Firebase initialization... ${Math.floor((Date.now() - startTime) / 1000)}s`)
      lastLogTime = Date.now()
    }
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Try to re-initialize if needed
    if (!db && getApps().length === 0 && isFirebaseConfigValid()) {
      try {
        const app = initializeApp(firebaseConfig)
        db = getFirestore(app)
        auth = getAuth(app)
        storage = getStorage(app)
        console.log("Firebase initialized (delayed)")
      } catch (error) {
        console.error("Firebase delayed initialization error:", error)
      }
    }
  }

  if (!db) {
    console.warn("Firebase database not available after waiting")
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
