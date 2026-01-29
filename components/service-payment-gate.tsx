"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Home, CreditCard } from "lucide-react"
import { MpesaPaymentDialog } from "./mpesa-payment-dialog"
import { useAuth } from "@/lib/auth-context"

import { hasActivePaidSession } from "@/lib/payment-session"

interface ServicePaymentGateProps {
  serviceType: string
  serviceId: string
  serviceName: string
  children: React.ReactNode
}

export function ServicePaymentGate({ serviceType, serviceId, serviceName, children }: ServicePaymentGateProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [hasPaid, setHasPaid] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // PAYMENT DISABLED - Direct access to all content
    // Users can access service details and videos without payment
    console.log("Payment gate disabled - granting direct access")
    setHasPaid(true) // Always grant access
    setIsChecking(false)
  }, [serviceType, serviceId])

  const handlePaymentSuccess = () => {
    console.log("Payment successful for service")
    const paymentKey = `service_paid_${serviceType}_${serviceId}`
    localStorage.setItem(paymentKey, "true")
    setHasPaid(true)
    setShowPaymentDialog(false)
  }

  const handleGoHome = () => {
    router.push("/")
  }

  if (isChecking) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Checking access...</span>
        </div>
      </div>
    )
  }

  // If payment is required and user hasn't paid, show payment gate
  if (!hasPaid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/30 dark:via-gray-950 dark:to-purple-950/30 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <Lock className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Payment Required</CardTitle>
            <CardDescription className="text-base">
              To view full details and contact information for <strong>{serviceName}</strong>, please complete the payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">What you'll get:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Full service details and description
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Direct contact information (phone, email)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Access to videos and additional media
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Location and pricing information
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleGoHome} className="flex-1">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
              <Button
                onClick={() => setShowPaymentDialog(true)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Pay to Continue
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* M-Pesa Payment Dialog */}
        {showPaymentDialog && (
          <MpesaPaymentDialog
            isOpen={showPaymentDialog}
            onClose={() => setShowPaymentDialog(false)}
            onSuccess={handlePaymentSuccess}
            serviceType={serviceType}
            actionType="Continue"
          />
        )}
      </div>
    )
  }

  // User has paid, show the content
  return <>{children}</>
}
