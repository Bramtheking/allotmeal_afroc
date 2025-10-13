import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

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
    throw new Error("Firebase configuration incomplete")
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  db = getFirestore(app)
  auth = getAuth(app)
  storage = getStorage(app)

  console.log("Firebase initialized successfully")
} catch (error) {
  console.error("Firebase initialization error:", error)
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
