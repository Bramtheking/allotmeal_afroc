"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle, Smartphone } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { isWhitelisted, getServicePricing, getMpesaSettings, saveTransaction, updateTransactionById } from "@/lib/mpesa-firebase"
import { hasActivePaidSession, recordPaymentSession } from "@/lib/payment-session"
import { toast } from "sonner"

interface MpesaPaymentDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  serviceType: string
  actionType: "Continue" | "Videos" | "PostService" | "JobApplication"
  amount?: number
  phoneNumber?: string
}

type PaymentStatus = "input" | "processing" | "success" | "failed"

export function MpesaPaymentDialog({
  isOpen,
  onClose,
  onSuccess,
  serviceType,
  actionType,
  amount: customAmount,
  phoneNumber: initialPhoneNumber,
}: MpesaPaymentDialogProps) {
  const { user } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || "")
  const [amount, setAmount] = useState<number>(0)
  const [status, setStatus] = useState<PaymentStatus>("input")
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [checkoutRequestId, setCheckoutRequestId] = useState("")
  const [pollIntervalRef, setPollIntervalRef] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isOpen) {
      checkWhitelistAndPricing()
    }
  }, [isOpen, serviceType, actionType, user, customAmount])

  const checkWhitelistAndPricing = async () => {
    setLoading(true)
    setStatus("input")
    setErrorMessage("")
    
    try {
      if (customAmount !== undefined) {
        setAmount(customAmount)
        setLoading(false)
        return
      }

      if (hasActivePaidSession(serviceType, actionType)) {
        console.log("Active payment session found, bypassing payment")
        setLoading(false)
        setTimeout(() => {
          toast.success("You have already paid for this service in this session")
          onSuccess()
          onClose()
        }, 0)
        return
      }

      if (user?.email) {
        console.log("Checking email whitelist for:", user.email)
        const emailWhitelisted = await isWhitelisted(user.email)
        if (emailWhitelisted) {
          console.log("Email is whitelisted, bypassing payment")
          setLoading(false)
          setTimeout(() => {
            toast.success("You are whitelisted - payment not required")
            onSuccess()
            onClose()
          }, 0)
          return
        }
      }

      // Try to fetch settings and pricing (single attempt, no retries)
      const [settings, pricing] = await Promise.all([
        getMpesaSettings(),
        getServicePricing(serviceType)
      ])

      // If payment is paused by admin, allow access
      if (settings?.isPaused) {
        console.log("Payment is paused by admin")
        setLoading(false)
        setTimeout(() => {
          toast.success("Payment requirement is currently paused")
          onSuccess()
          onClose()
        }, 0)
        return
      }

      // If no pricing configured or Firebase unavailable, allow access
      if (!pricing) {
        console.log("No pricing configured or Firebase unavailable, allowing access")
        setLoading(false)
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 0)
        return
      }

      let requiredAmount = 0
      if (actionType === "Continue") {
        requiredAmount = pricing.continueAmount
      } else if (actionType === "Videos") {
        requiredAmount = pricing.videosAmount
      } else if (actionType === "PostService") {
        requiredAmount = pricing.postServiceAmount || 0
      } else if (actionType === "JobApplication") {
        requiredAmount = pricing.jobApplicationAmount || 0
      }
      
      // If amount is undefined, null, or not a valid number, let them through
      if (requiredAmount === undefined || requiredAmount === null || isNaN(requiredAmount) || requiredAmount === 0) {
        console.log(`No payment required for ${actionType}`)
        setLoading(false)
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 0)
        return
      }

      console.log(`Payment required: KSh ${requiredAmount}`)
      setAmount(requiredAmount)
    } catch (error) {
      console.error("Error checking whitelist/pricing:", error)
      setErrorMessage("Failed to load payment settings. Please check your internet connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneNumberChange = async (value: string) => {
    setPhoneNumber(value)
    
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 9) {
      console.log("Checking phone whitelist for:", value)
      const whitelisted = await isWhitelisted(value)
      if (whitelisted) {
        console.log("Phone is whitelisted, bypassing payment")
        setTimeout(() => {
          toast.success("This phone number is whitelisted - payment not required")
          onSuccess()
          onClose()
        }, 100)
      }
    }
  }

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      setErrorMessage("Please enter a valid phone number")
      return
    }

    setStatus("processing")
    setErrorMessage("")

    let pollInterval: NodeJS.Timeout | null = null

    try {
      const transactionId = await saveTransaction({
        merchantRequestId: "",
        checkoutRequestId: "",
        phoneNumber,
        amount,
        serviceType,
        actionType,
        userId: user?.uid || undefined,
        userEmail: user?.email || undefined,
        timestamp: new Date().toISOString(),
        status: "pending",
      })

      const response = await fetch("/.netlify/functions/stkPush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          amount,
          serviceType,
          actionType,
          userId: user?.uid || null,
          transactionId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      const text = await response.text()
      if (!text || text.trim() === '') {
        throw new Error("Empty response from payment server")
      }

      let data
      try {
        data = JSON.parse(text)
      } catch (jsonError) {
        console.error("JSON parse error. Response text:", text)
        throw new Error("Invalid response from payment server. Please try again.")
      }

      if (data.success && data.data) {
        const checkoutId = data.data.CheckoutRequestID
        const merchantId = data.data.MerchantRequestID
        setCheckoutRequestId(checkoutId)
        try {
          await updateTransactionById(transactionId, {
            checkoutRequestId: checkoutId,
            merchantRequestId: merchantId,
            status: "pending",
          })
        } catch (e) {
          console.error("Failed to attach checkout/merchant IDs to transaction:", e)
        }
        
        toast.info("Payment request sent to your phone. Please enter your M-Pesa PIN to complete the payment.")
        
        let pollAttempts = 0
        const maxPolls = 40
        
        pollInterval = setInterval(async () => {
          pollAttempts++
          
          try {
            const { getFirebaseDb } = await import("@/lib/firebase")
            const { doc, getDoc } = await import("firebase/firestore")
            
            const db = getFirebaseDb()
            if (!db) {
              console.error("Firebase not available")
              return
            }
            
            const callbackDoc = await getDoc(doc(db, "mpesa_callback_results", checkoutId))
            
            if (callbackDoc.exists()) {
              const callbackData = callbackDoc.data()
              
              if (pollInterval) clearInterval(pollInterval)
              setPollIntervalRef(null)
              
              if (callbackData.status === "success" || callbackData.resultCode === 0) {
                const { updateTransaction } = await import("@/lib/mpesa-firebase")
                await updateTransaction(checkoutId, {
                  status: "success",
                  resultCode: callbackData.resultCode,
                  resultDesc: callbackData.resultDesc,
                  mpesaReceiptNumber: callbackData.mpesaReceiptNumber,
                  transactionDate: callbackData.transactionDate,
                })
                
                recordPaymentSession(serviceType, actionType, phoneNumber, transactionId)
                
                setStatus("success")
                toast.success("Payment successful!")
                
                setTimeout(() => {
                  onSuccess()
                  onClose()
                }, 2000)
              } else {
                const { updateTransaction } = await import("@/lib/mpesa-firebase")
                await updateTransaction(checkoutId, {
                  status: "failed",
                  resultCode: callbackData.resultCode,
                  resultDesc: callbackData.resultDesc,
                })
                
                setStatus("failed")
                setErrorMessage(callbackData.resultDesc || "Payment failed or was cancelled")
                toast.error("Payment failed or was cancelled")
              }
            } else if (pollAttempts >= maxPolls) {
              if (pollInterval) clearInterval(pollInterval)
              setPollIntervalRef(null)
              setStatus("failed")
              setErrorMessage("Payment verification timeout. Please check your transaction history.")
              toast.error("Unable to verify payment. Please contact support if payment was deducted.")
            }
          } catch (error) {
            console.error("Error polling callback results:", error)
          }
        }, 3000)
        
        setPollIntervalRef(pollInterval)
      } else {
        throw new Error(data.error || "Payment failed")
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      if (pollInterval) clearInterval(pollInterval)
      setPollIntervalRef(null)
      setStatus("failed")
      setErrorMessage(error.message || "Payment failed. Please try again.")
      toast.error("Payment failed. Please try again.")
    }
  }

  const handleClose = () => {
    if (status === "processing") {
      if (confirm("Are you sure you want to cancel? The payment may still be processing on your phone.")) {
        if (pollIntervalRef) {
          clearInterval(pollIntervalRef)
          setPollIntervalRef(null)
        }
        setPhoneNumber("")
        setStatus("input")
        setErrorMessage("")
        setCheckoutRequestId("")
        onClose()
      }
    } else {
      if (pollIntervalRef) {
        clearInterval(pollIntervalRef)
        setPollIntervalRef(null)
      }
      setPhoneNumber("")
      setStatus("input")
      setErrorMessage("")
      setCheckoutRequestId("")
      onClose()
    }
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground text-center">
              Loading payment settings...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white">
              <Smartphone className="h-5 w-5" />
            </div>
            M-Pesa Payment
          </DialogTitle>
          <DialogDescription>
            Complete payment to {
              actionType === "Continue" ? "access service details" :
              actionType === "Videos" ? "access videos" :
              actionType === "PostService" ? "post your service" :
              "apply for this job"
            }
          </DialogDescription>
        </DialogHeader>

        {status === "input" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount to Pay</span>
                <div className="flex items-center gap-1 text-2xl font-bold text-green-600 dark:text-green-400">
                  KSh {amount.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter Phone number here"
                value={phoneNumber}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Enter your Safaricom M-Pesa registered phone number
              </p>
            </div>

            {errorMessage && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handlePayment} className="flex-1 bg-green-600 hover:bg-green-700">
                Pay Now
              </Button>
            </div>
          </div>
        )}

        {status === "processing" && (
          <div className="py-8 space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-16 w-16 animate-spin text-green-600" />
              <div className="text-center">
                <p className="font-semibold">Processing Payment...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Check your phone and enter your M-Pesa PIN
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleClose} className="w-full">
              Cancel Transaction
            </Button>
          </div>
        )}

        {status === "success" && (
          <div className="py-8 space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">Payment Successful!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  You will be redirected shortly...
                </p>
              </div>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="py-8 space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">Payment Failed</p>
                <p className="text-sm text-muted-foreground mt-2">{errorMessage}</p>
              </div>
            </div>
            <Button onClick={() => setStatus("input")} className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
