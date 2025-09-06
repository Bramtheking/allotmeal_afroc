import AnalyticsDashboard from "@/components/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-red-950/30 dark:via-gray-950 dark:to-blue-950/30">
      <div className="container py-8">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}
