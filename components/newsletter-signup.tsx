"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Send } from "lucide-react"
import { toast } from "sonner"
import { collection, addDoc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error("Please enter your email address")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const db = await getFirebaseDb()
      if (!db) {
        // Development mode fallback - store in localStorage
        const mockSubscribers = JSON.parse(localStorage.getItem("newsletter_subscribers_dev") || "[]")
        const subscription = {
          email: email.trim().toLowerCase(),
          subscribeDate: new Date().toISOString(),
          status: "active"
        }
        mockSubscribers.push(subscription)
        localStorage.setItem("newsletter_subscribers_dev", JSON.stringify(mockSubscribers))
        
        toast.success("Successfully subscribed! (dev mode - not saved to Firebase)")
        setEmail("")
        return
      }

      await addDoc(collection(db, "newsletter_subscribers"), {
        email: email.trim().toLowerCase(),
        subscribeDate: new Date().toISOString(),
        status: "active"
      })

      toast.success("Successfully subscribed to our newsletter!")
      setEmail("")
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-blue-50 dark:from-yellow-950/20 dark:to-blue-950/20 border-yellow-200 dark:border-yellow-800">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-xl font-bold">
          <Mail className="h-5 w-5 text-yellow-600" />
          Stay Updated
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get the latest news and updates about our services delivered to your inbox
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading} className="shrink-0">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}