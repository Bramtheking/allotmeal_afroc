// Payment session management using cookies
// Tracks which services a user has paid for in their current session

interface PaymentSession {
  serviceType: string
  actionType: "Continue" | "Videos"
  phoneNumber: string
  paidAt: string
  transactionId: string
}

const COOKIE_NAME = "paid_services"
const SESSION_DURATION_HOURS = 3 // Session lasts 3 hours

/**
 * Get all paid sessions from cookie
 */
function getPaidSessions(): PaymentSession[] {
  if (typeof window === "undefined") return []
  
  try {
    const cookies = document.cookie.split(";")
    const cookie = cookies.find((c) => c.trim().startsWith(`${COOKIE_NAME}=`))
    
    if (!cookie) return []
    
    const value = cookie.split("=")[1]
    const decoded = decodeURIComponent(value)
    return JSON.parse(decoded)
  } catch (error) {
    console.error("Error reading paid sessions:", error)
    return []
  }
}

/**
 * Save paid sessions to cookie
 */
function savePaidSessions(sessions: PaymentSession[]): void {
  if (typeof window === "undefined") return
  
  try {
    // Remove expired sessions (older than SESSION_DURATION_HOURS)
    const now = new Date()
    const validSessions = sessions.filter((session) => {
      const paidAt = new Date(session.paidAt)
      const hoursDiff = (now.getTime() - paidAt.getTime()) / (1000 * 60 * 60)
      return hoursDiff < SESSION_DURATION_HOURS
    })
    
    const value = encodeURIComponent(JSON.stringify(validSessions))
    const expires = new Date()
    expires.setHours(expires.getHours() + SESSION_DURATION_HOURS)
    
    document.cookie = `${COOKIE_NAME}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
  } catch (error) {
    console.error("Error saving paid sessions:", error)
  }
}

/**
 * Check if user has already paid for a specific service
 */
export function hasActivePaidSession(serviceType: string, actionType: "Continue" | "Videos"): boolean {
  const sessions = getPaidSessions()
  
  return sessions.some(
    (session) =>
      session.serviceType === serviceType &&
      session.actionType === actionType
  )
}

/**
 * Record a successful payment in the session
 */
export function recordPaymentSession(
  serviceType: string,
  actionType: "Continue" | "Videos",
  phoneNumber: string,
  transactionId: string
): void {
  const sessions = getPaidSessions()
  
  // Check if session already exists (shouldn't happen, but just in case)
  const existingIndex = sessions.findIndex(
    (s) => s.serviceType === serviceType && s.actionType === actionType
  )
  
  const newSession: PaymentSession = {
    serviceType,
    actionType,
    phoneNumber,
    paidAt: new Date().toISOString(),
    transactionId,
  }
  
  if (existingIndex >= 0) {
    // Update existing session
    sessions[existingIndex] = newSession
  } else {
    // Add new session
    sessions.push(newSession)
  }
  
  savePaidSessions(sessions)
  console.log(`Payment session recorded: ${serviceType} - ${actionType}`)
}

/**
 * Clear all payment sessions (logout, manual clear, etc.)
 */
export function clearPaymentSessions(): void {
  if (typeof window === "undefined") return
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  console.log("Payment sessions cleared")
}

/**
 * Get details of a paid session
 */
export function getPaidSessionDetails(serviceType: string, actionType: "Continue" | "Videos"): PaymentSession | null {
  const sessions = getPaidSessions()
  return sessions.find(
    (s) => s.serviceType === serviceType && s.actionType === actionType
  ) || null
}

/**
 * Get all active paid sessions for display
 */
export function getAllActiveSessions(): PaymentSession[] {
  return getPaidSessions()
}
