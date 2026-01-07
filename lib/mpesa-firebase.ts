import { getFirebaseDb } from "./firebase"
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  limit 
} from "firebase/firestore"

export interface MpesaServicePricing {
  serviceType: string
  continueAmount: number
  videosAmount: number
  postServiceAmount: number // Amount to post a service in this category
  jobApplicationAmount?: number // Amount for job applications (optional, only for jobs)
  updatedAt: string
  updatedBy: string
}

export interface MpesaWhitelistEntry {
  id?: string
  type: "phone" | "email"
  value: string
  addedAt: string
  addedBy: string
  deleted?: boolean
}

export interface MpesaSettings {
  isPaused: boolean
  updatedAt: string
  updatedBy: string
}

export interface MpesaTransaction {
  id?: string
  merchantRequestId: string
  checkoutRequestId: string
  phoneNumber: string
  amount: number
  serviceType: string
  actionType: "Continue" | "Videos" | "PostService" | "JobApplication"
  userId?: string
  userEmail?: string
  resultCode?: number
  resultDesc?: string
  mpesaReceiptNumber?: string
  transactionDate?: string
  timestamp: string
  status: "pending" | "success" | "failed" | "cancelled"
}

export async function getMpesaSettings(): Promise<MpesaSettings | null> {
  try {
    const db = await getFirebaseDb()
    if (!db) {
      // Return default settings if Firebase not available
      return { isPaused: false, updatedAt: new Date().toISOString(), updatedBy: "system" }
    }

    const settingsDoc = await getDoc(doc(db, "mpesa_settings", "global"))
    if (settingsDoc.exists()) {
      return settingsDoc.data() as MpesaSettings
    }
    
    // Return default settings if document doesn't exist
    return { isPaused: false, updatedAt: new Date().toISOString(), updatedBy: "system" }
  } catch (error) {
    console.error("[getMpesaSettings] Error:", error)
    // Return default settings on error
    return { isPaused: false, updatedAt: new Date().toISOString(), updatedBy: "system" }
  }
}

export async function updateMpesaSettings(settings: Partial<MpesaSettings>, userId: string): Promise<void> {
  try {
    const db = await getFirebaseDb()
    if (!db) throw new Error("Database not initialized")

    await setDoc(doc(db, "mpesa_settings", "global"), {
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    }, { merge: true })
  } catch (error) {
    console.error("Error updating M-Pesa settings:", error)
    throw error
  }
}

export async function getServicePricing(serviceType: string): Promise<MpesaServicePricing | null> {
  try {
    const db = await getFirebaseDb()
    if (!db) {
      return null
    }

    const pricingDoc = await getDoc(doc(db, "mpesa_service_pricing", serviceType))
    
    if (pricingDoc.exists()) {
      return pricingDoc.data() as MpesaServicePricing
    }
    
    return null
  } catch (error) {
    console.error("[getServicePricing] Error:", error)
    return null
  }
}

export async function getAllServicePricing(): Promise<MpesaServicePricing[]> {
  try {
    const db = await getFirebaseDb()
    if (!db) return []

    const pricingSnapshot = await getDocs(collection(db, "mpesa_service_pricing"))
    const pricing: MpesaServicePricing[] = []
    pricingSnapshot.forEach((doc) => {
      const data = doc.data() as MpesaServicePricing & { deleted?: boolean }
      if (!data.deleted) {
        pricing.push(data as MpesaServicePricing)
      }
    })
    
    return pricing
  } catch (error) {
    console.error("Error getting all service pricing:", error)
    return []
  }
}

export async function setServicePricing(pricing: MpesaServicePricing, userId: string): Promise<void> {
  try {
    const db = await getFirebaseDb()
    if (!db) throw new Error("Database not initialized")

    await setDoc(doc(db, "mpesa_service_pricing", pricing.serviceType), {
      ...pricing,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    })
  } catch (error) {
    console.error("Error setting service pricing:", error)
    throw error
  }
}

export async function deleteServicePricing(serviceType: string): Promise<void> {
  try {
    const db = await getFirebaseDb()
    if (!db) throw new Error("Database not initialized")

    await updateDoc(doc(db, "mpesa_service_pricing", serviceType), { 
      deleted: true,
      deletedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error deleting service pricing:", error)
    throw error
  }
}

export async function getWhitelist(): Promise<MpesaWhitelistEntry[]> {
  try {
    const db = await getFirebaseDb()
    if (!db) return []

    const whitelistSnapshot = await getDocs(collection(db, "mpesa_whitelist"))
    const whitelist: MpesaWhitelistEntry[] = []
    whitelistSnapshot.forEach((doc) => {
      whitelist.push({ id: doc.id, ...doc.data() } as MpesaWhitelistEntry)
    })
    
    return whitelist
  } catch (error) {
    console.error("Error getting whitelist:", error)
    return []
  }
}

export async function addToWhitelist(entry: Omit<MpesaWhitelistEntry, "id">, userId: string): Promise<void> {
  try {
    const db = await getFirebaseDb()
    if (!db) throw new Error("Database not initialized")

    await addDoc(collection(db, "mpesa_whitelist"), {
      ...entry,
      addedAt: new Date().toISOString(),
      addedBy: userId,
    })
  } catch (error) {
    console.error("Error adding to whitelist:", error)
    throw error
  }
}

export async function removeFromWhitelist(id: string): Promise<void> {
  try {
    const db = await getFirebaseDb()
    if (!db) throw new Error("Database not initialized")

    const whitelistRef = doc(db, "mpesa_whitelist", id)
    await updateDoc(whitelistRef, { deleted: true })
  } catch (error) {
    console.error("Error removing from whitelist:", error)
    throw error
  }
}

function normalizePhoneNumber(phone: string): string[] {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Generate possible variations
  const variations: string[] = [cleaned]
  
  // If starts with 0, add 254 version
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    variations.push('254' + cleaned.substring(1))
  }
  
  // If starts with 254, add 0 version
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    variations.push('0' + cleaned.substring(3))
  }
  
  // If starts with +254, add both versions
  if (phone.startsWith('+254')) {
    const withoutPlus = cleaned.substring(3)
    variations.push('0' + withoutPlus)
    variations.push('254' + withoutPlus)
  }
  
  return variations
}

export async function isWhitelisted(phoneOrEmail: string): Promise<boolean> {
  try {
    const db = await getFirebaseDb()
    if (!db) return false

    // Check if it's an email
    const isEmail = phoneOrEmail.includes('@')
    
    if (isEmail) {
      // For emails, do exact match (case-insensitive)
      const normalizedEmail = phoneOrEmail.toLowerCase().trim()
      const whitelistSnapshot = await getDocs(
        query(
          collection(db, "mpesa_whitelist"),
          where("type", "==", "email")
        )
      )
      
      for (const doc of whitelistSnapshot.docs) {
        const data = doc.data()
        if (data.deleted === true) continue
        if (data.value.toLowerCase().trim() === normalizedEmail) {
          return true
        }
      }
      return false
    } else {
      // For phone numbers, check all variations
      const phoneVariations = normalizePhoneNumber(phoneOrEmail)
      
      const whitelistSnapshot = await getDocs(
        query(
          collection(db, "mpesa_whitelist"),
          where("type", "==", "phone")
        )
      )
      
      for (const doc of whitelistSnapshot.docs) {
        const data = doc.data()
        if (data.deleted === true) continue
        
        const whitelistedVariations = normalizePhoneNumber(data.value)
        
        // Check if any variation matches
        for (const userVar of phoneVariations) {
          for (const whiteVar of whitelistedVariations) {
            if (userVar === whiteVar) {
              return true
            }
          }
        }
      }
      return false
    }
  } catch (error) {
    console.error("Error checking whitelist:", error)
    return false
  }
}

export async function saveTransaction(transaction: Omit<MpesaTransaction, "id">): Promise<string> {
  try {
    const db = await getFirebaseDb()
    if (!db) throw new Error("Database not initialized")

    // Filter out undefined values - Firestore doesn't accept them
    const cleanTransaction = Object.fromEntries(
      Object.entries(transaction).filter(([_, value]) => value !== undefined)
    )

    const docRef = await addDoc(collection(db, "mpesa_transactions"), cleanTransaction)
    return docRef.id
  } catch (error) {
    console.error("Error saving transaction:", error)
    throw error
  }
}

export async function updateTransaction(checkoutRequestId: string, updates: Partial<MpesaTransaction>): Promise<void> {
  try {
    const db = await getFirebaseDb()
    if (!db) throw new Error("Database not initialized")

    // Filter out undefined values - Firestore doesn't accept them
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    )

    const transactionsQuery = query(
      collection(db, "mpesa_transactions"),
      where("checkoutRequestId", "==", checkoutRequestId),
      limit(1)
    )
    
    const snapshot = await getDocs(transactionsQuery)
    if (!snapshot.empty) {
      const transactionDoc = snapshot.docs[0]
      await updateDoc(doc(db, "mpesa_transactions", transactionDoc.id), cleanUpdates)
    }
  } catch (error) {
    console.error("Error updating transaction:", error)
    throw error
  }
}

export async function updateTransactionById(id: string, updates: Partial<MpesaTransaction>): Promise<void> {
  try {
    const db = await getFirebaseDb()
    if (!db) throw new Error("Database not initialized")

    // Filter out undefined values - Firestore doesn't accept them
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    )

    await updateDoc(doc(db, "mpesa_transactions", id), cleanUpdates)
  } catch (error) {
    console.error("Error updating transaction by ID:", error)
    throw error
  }
}

export async function getTransactions(limitCount: number = 50): Promise<MpesaTransaction[]> {
  try {
    const db = await getFirebaseDb()
    if (!db) return []

    const transactionsQuery = query(
      collection(db, "mpesa_transactions"),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    )
    
    const snapshot = await getDocs(transactionsQuery)
    const transactions: MpesaTransaction[] = []
    snapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() } as MpesaTransaction)
    })
    
    return transactions
  } catch (error) {
    console.error("Error getting transactions:", error)
    return []
  }
}

export async function getUserTransactions(userId: string): Promise<MpesaTransaction[]> {
  try {
    const db = await getFirebaseDb()
    if (!db) return []

    const transactionsQuery = query(
      collection(db, "mpesa_transactions"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    )
    
    const snapshot = await getDocs(transactionsQuery)
    const transactions: MpesaTransaction[] = []
    snapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() } as MpesaTransaction)
    })
    
    return transactions
  } catch (error) {
    console.error("Error getting user transactions:", error)
    return []
  }
}
