// Manual visitor counting system - counts browser sessions, not page reloads
// Uses sessionStorage to track if current session has been counted (resets on browser close)

export interface UniqueVisitorRecord {
  timestamp: string
  date: string // YYYY-MM-DD format
  week: string // YYYY-WW format
  month: string // YYYY-MM format
  year: string // YYYY format
  userAgent: string
  sessionId: string
  isFirstVisit: boolean
}

// Generate a unique session ID for this browser session
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Check if this is a unique visit (not a reload in same session)
const isUniqueVisit = (): boolean => {
  // Check if this browser session has already been counted
  const sessionVisited = sessionStorage.getItem('allotmeal_session_tracked')
  return !sessionVisited
}

// Mark this browser session as having visited
const markVisited = (): void => {
  const now = new Date()
  // Use sessionStorage so it resets when browser is closed/reopened
  sessionStorage.setItem('allotmeal_session_tracked', now.toISOString())
}

// Get week number for a date
const getWeekNumber = (date: Date): string => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-${weekNo.toString().padStart(2, '0')}`
}

// Manual visitor counting - stores in browser's localStorage and returns visitor data
export const countUniqueVisitor = (): UniqueVisitorRecord | null => {
  try {
    // Check if this is a unique visit
    if (!isUniqueVisit()) {
      console.log("[Manual Counter] Not counting - user already visited")
      return null
    }

    const now = new Date()
    const visitorRecord: UniqueVisitorRecord = {
      timestamp: now.toISOString(),
      date: now.toISOString().split('T')[0], // YYYY-MM-DD
      week: getWeekNumber(now), // YYYY-WW
      month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`, // YYYY-MM
      year: String(now.getFullYear()),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      sessionId: generateSessionId(),
      isFirstVisit: true
    }

    // Mark this browser as visited
    markVisited()

    // Store visitor data in localStorage for local tracking
    const existingVisitors = JSON.parse(localStorage.getItem('allotmeal_visitors') || '[]')
    existingVisitors.push(visitorRecord)
    localStorage.setItem('allotmeal_visitors', JSON.stringify(existingVisitors))

    console.log("[Manual Counter] Unique visitor counted successfully")
    return visitorRecord

  } catch (error) {
    console.error("[Manual Counter] Error counting visitor:", error)
    return null
  }
}

// Get visitor statistics from localStorage
export const getManualVisitorStats = () => {
  try {
    const visitors = JSON.parse(localStorage.getItem('allotmeal_visitors') || '[]') as UniqueVisitorRecord[]
    
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const thisWeek = getWeekNumber(now)
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const thisYear = String(now.getFullYear())

    const totalViews = visitors.length
    const todayViews = visitors.filter(v => v.date === today).length
    const thisWeekViews = visitors.filter(v => v.week === thisWeek).length
    const thisMonthViews = visitors.filter(v => v.month === thisMonth).length
    const thisYearViews = visitors.filter(v => v.year === thisYear).length

    // Get daily stats for last 30 days
    const dailyStats = new Map<string, number>()
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    last30Days.forEach(date => {
      dailyStats.set(date, 0)
    })

    visitors.forEach(visitor => {
      if (dailyStats.has(visitor.date)) {
        dailyStats.set(visitor.date, (dailyStats.get(visitor.date) || 0) + 1)
      }
    })

    const dailyViews = Array.from(dailyStats.entries()).map(([date, views]) => ({
      date,
      views
    }))

    // Get weekly stats for last 12 weeks
    const weeklyStats = new Map<string, number>()
    const last12Weeks = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (i * 7))
      return getWeekNumber(date)
    }).reverse()

    last12Weeks.forEach(week => {
      weeklyStats.set(week, 0)
    })

    visitors.forEach(visitor => {
      if (weeklyStats.has(visitor.week)) {
        weeklyStats.set(visitor.week, (weeklyStats.get(visitor.week) || 0) + 1)
      }
    })

    const weeklyViews = Array.from(weeklyStats.entries()).map(([week, views]) => ({
      week,
      views
    }))

    // Get monthly stats for last 12 months
    const monthlyStats = new Map<string, number>()
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    }).reverse()

    last12Months.forEach(month => {
      monthlyStats.set(month, 0)
    })

    visitors.forEach(visitor => {
      if (monthlyStats.has(visitor.month)) {
        monthlyStats.set(visitor.month, (monthlyStats.get(visitor.month) || 0) + 1)
      }
    })

    const monthlyViews = Array.from(monthlyStats.entries()).map(([month, views]) => ({
      month,
      views
    }))

    return {
      totalViews,
      todayViews,
      thisWeekViews,
      thisMonthViews,
      thisYearViews,
      dailyViews,
      weeklyViews,
      monthlyViews,
      uniqueVisitorsOnly: true
    }

  } catch (error) {
    console.error("[Manual Counter] Error getting stats:", error)
    return {
      totalViews: 0,
      todayViews: 0,
      thisWeekViews: 0,
      thisMonthViews: 0,
      thisYearViews: 0,
      dailyViews: [],
      weeklyViews: [],
      monthlyViews: [],
      uniqueVisitorsOnly: true
    }
  }
}

// Reset visitor tracking (for testing purposes)
export const resetVisitorTracking = () => {
  sessionStorage.removeItem('allotmeal_session_tracked')
  localStorage.removeItem('allotmeal_visitors')
  console.log("[Manual Counter] Visitor tracking reset")
}
