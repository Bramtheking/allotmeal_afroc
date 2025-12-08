"use client"

import { useEffect } from "react"
import { countUniqueVisitor } from "@/lib/manual-visitor-counter"

interface VisitorTrackerProps {
  page?: string
}

export default function VisitorTracker({ page = "homepage" }: VisitorTrackerProps) {
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const visitorData = countUniqueVisitor()
      if (visitorData) {
        console.log(`[Manual Tracker] Unique visitor counted for page: ${page}`)
      } else {
        console.log(`[Manual Tracker] Visitor already counted, skipping duplicate for page: ${page}`)
      }
    }
  }, [page])

  // This component doesn't render anything
  return null
}
