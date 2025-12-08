"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getManualVisitorStats, resetVisitorTracking } from "@/lib/manual-visitor-counter"
import { BarChart3, Eye, TrendingUp, Calendar, Users, RefreshCw } from "lucide-react"

interface AnalyticsStats {
  totalViews: number
  todayViews: number
  thisWeekViews: number
  thisMonthViews: number
  thisYearViews: number
  dailyViews: Array<{ date: string; views: number }>
  weeklyViews: Array<{ week: string; views: number }>
  monthlyViews: Array<{ month: string; views: number }>
  uniqueVisitorsOnly: boolean
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<AnalyticsStats>({
    totalViews: 0,
    todayViews: 0,
    thisWeekViews: 0,
    thisMonthViews: 0,
    thisYearViews: 0,
    dailyViews: [],
    weeklyViews: [],
    monthlyViews: [],
    uniqueVisitorsOnly: true
  })
  
  const [loading, setLoading] = useState(true)

  const loadStats = () => {
    setLoading(true)
    const visitorStats = getManualVisitorStats()
    setStats(visitorStats)
    setLoading(false)
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleResetTracking = () => {
    if (confirm("Are you sure you want to reset all visitor tracking data? This cannot be undone.")) {
      resetVisitorTracking()
      loadStats()
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading analytics...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Website Analytics</h2>
          <p className="text-muted-foreground">Manual visitor tracking - unique visits only</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={loadStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="destructive" onClick={handleResetTracking}>
            Reset Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">All time unique visitors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayViews}</div>
            <p className="text-xs text-muted-foreground">Unique visitors today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeekViews}</div>
            <p className="text-xs text-muted-foreground">Unique visitors this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonthViews}</div>
            <p className="text-xs text-muted-foreground">Unique visitors this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisYearViews}</div>
            <p className="text-xs text-muted-foreground">Unique visitors this year</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Visitors (Last 30 Days)</CardTitle>
          <CardDescription>Unique visitors per day</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.dailyViews.length > 0 ? (
            <div className="space-y-2">
              {stats.dailyViews.slice(-10).map((day, index) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 bg-blue-500 rounded"
                      style={{ width: `${Math.max(day.views * 20, 4)}px` }}
                    />
                    <span className="text-sm font-medium">{day.views}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No daily data available</p>
          )}
        </CardContent>
      </Card>

      {/* Weekly Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Visitors (Last 12 Weeks)</CardTitle>
          <CardDescription>Unique visitors per week</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.weeklyViews.length > 0 ? (
            <div className="space-y-2">
              {stats.weeklyViews.slice(-8).map((week, index) => (
                <div key={week.week} className="flex items-center justify-between">
                  <span className="text-sm">Week {week.week}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 bg-green-500 rounded"
                      style={{ width: `${Math.max(week.views * 10, 4)}px` }}
                    />
                    <span className="text-sm font-medium">{week.views}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No weekly data available</p>
          )}
        </CardContent>
      </Card>

      {/* Monthly Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Visitors (Last 12 Months)</CardTitle>
          <CardDescription>Unique visitors per month</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.monthlyViews.length > 0 ? (
            <div className="space-y-2">
              {stats.monthlyViews.slice(-6).map((month, index) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm">{month.month}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 bg-purple-500 rounded"
                      style={{ width: `${Math.max(month.views * 5, 4)}px` }}
                    />
                    <span className="text-sm font-medium">{month.views}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No monthly data available</p>
          )}
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking System Information</CardTitle>
          <CardDescription>How the visitor tracking works</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Manual tracking system active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Only counts unique visitors (no duplicate page reloads)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Data stored locally in browser storage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Analytics grouped by day, week, month, and year</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
