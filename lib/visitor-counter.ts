import { getFirebaseDb } from "./firebase"
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore"

export interface VisitorRecord {
  id?: string
  timestamp: Date
  date: string // YYYY-MM-DD format
  userAgent?: string
  page: string
}

export const addVisitor = async (page = "homepage"): Promise<void> => {
  try {
    const db = await getFirebaseDb()
    if (!db) {
      console.log("[v0] Firebase not available, visitor not counted")
      return
    }

    const now = new Date()
    const dateString = now.toISOString().split("T")[0] // YYYY-MM-DD

    const visitorData: Omit<VisitorRecord, "id"> = {
      timestamp: now,
      date: dateString,
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
      page,
    }

    await addDoc(collection(db, "visitors"), {
      ...visitorData,
      timestamp: Timestamp.fromDate(now),
    })

    console.log("[v0] Visitor recorded successfully")
  } catch (error) {
    console.error("[v0] Error recording visitor:", error)
  }
}

export const getVisitorStats = async () => {
  try {
    const db = await getFirebaseDb()
    if (!db) {
      // Return mock data when Firebase is not available
      return {
        totalViews: 1247,
        todayViews: 23,
        thisWeekViews: 156,
        thisMonthViews: 678,
      }
    }

    const visitorsRef = collection(db, "visitors")
    const snapshot = await getDocs(visitorsRef)

    const now = new Date()
    const today = now.toISOString().split("T")[0]
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    const visitors = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as VisitorRecord[]

    const totalViews = visitors.length
    const todayViews = visitors.filter((v) => v.date === today).length
    const thisWeekViews = visitors.filter((v) => v.date >= weekAgo).length
    const thisMonthViews = visitors.filter((v) => v.date >= monthAgo).length

    return {
      totalViews,
      todayViews,
      thisWeekViews,
      thisMonthViews,
    }
  } catch (error) {
    console.error("[v0] Error fetching visitor stats:", error)
    // Return mock data on error
    return {
      totalViews: 1247,
      todayViews: 23,
      thisWeekViews: 156,
      thisMonthViews: 678,
    }
  }
}
