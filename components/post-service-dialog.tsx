"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CreditCard, CheckCircle2, Shield } from "lucide-react"
import { toast } from "sonner"
import { getServicePricing, isWhitelisted } from "@/lib/mpesa-firebase"
import { MpesaPaymentDialog } from "./mpesa-payment-dialog"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface PostServiceDialogProps {
  isOpen: boolean
  onClose: () => void
}

const serviceTypes = [
  { value: "hotel-industry", label: "Hotel & Industry" },
  { value: "jobs", label: "Jobs" },
  { value: "construction", label: "Construction" },
  { value: "agriculture", label: "Agriculture" },
  { value: "entertainment", label: "Entertainment" },
  { value: "sme-products", label: "SME Products" },
  { value: "tenders", label: "Tenders" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "transport", label: "Transport" },
  { value: "sermon", label: "Sermon" },
]

export function PostServiceDialog({ isOpen, onClose }: PostServiceDialogProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<"select" | "details" | "payment" | "success">("select")
  const [selectedService, setSelectedService] = useState("")
  const [pricing, setPricing] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [isCheckingWhitelist, setIsCheckingWhitelist] = useState(false)
  const [isWhitelistedUser, setIsWhitelistedUser] = useState(false)
  
  // Service details
  const [phoneNumber, setPhoneNumber] = useState("")
  const [serviceTitle, setServiceTitle] = useState("")
  const [serviceDescription, setServiceDescription] = useState("")

  useEffect(() => {
    if (isOpen) {
      setStep("select")
      setSelectedService("")
      setPricing(null)
      setPhoneNumber("")
      setServiceTitle("")
      setServiceDescription("")
      setIsWhitelistedUser(false)
      checkEmailWhitelist()
    }
  }, [isOpen])

  const checkEmailWhitelist = async () => {
    if (user?.email) {
      const whitelisted = await isWhitelisted(user.email)
      if (whitelisted) {
        setIsWhitelistedUser(true)
        toast.success("Your email is whitelisted - no payment required!")
      }
    }
  }

  const handlePhoneNumberChange = async (value: string) => {
    setPhoneNumber(value)
    
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 9) {
      setIsCheckingWhitelist(true)
      try {
        const whitelisted = await isWhitelisted(value)
        if (whitelisted) {
          setIsWhitelistedUser(true)
          toast.success("This phone number is whitelisted - no payment required!")
        } else {
          setIsWhitelistedUser(false)
        }
      } catch (error) {
        console.error("Error checking whitelist:", error)
      } finally {
        setIsCheckingWhitelist(false)
      }
    }
  }

  const handleServiceSelect = async (serviceType: string) => {
    setSelectedService(serviceType)
    setLoading(true)

    try {
      const pricingData = await getServicePricing(serviceType)
      if (pricingData && pricingData.postServiceAmount) {
        setPricing(pricingData.postServiceAmount)
      } else {
        setPricing(0)
        toast.info("This service category is currently free to post!")
      }
    } catch (error) {
      console.error("Error fetching pricing:", error)
      toast.error("Failed to load pricing information")
      setPricing(null)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (!selectedService) {
      toast.error("Please select a service category")
      return
    }
    setStep("details")
  }

  const handleSubmitDetails = () => {
    if (!phoneNumber || !serviceTitle || !serviceDescription) {
      toast.error("Please fill in all required fields")
      return
    }

    // Validate phone number format
    const phoneRegex = /^(\+?254|0)[17]\d{8}$/
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      toast.error("Please enter a valid Kenyan phone number")
      return
    }

    if (pricing === 0 || isWhitelistedUser) {
      // Free posting or whitelisted - skip payment
      handlePaymentSuccess()
    } else {
      setStep("payment")
      setShowPaymentDialog(true)
    }
  }

  const handlePaymentSuccess = () => {
    setShowPaymentDialog(false)
    setStep("success")
    
    // Store service posting session
    const postingData = {
      serviceType: selectedService,
      phoneNumber,
      serviceTitle,
      serviceDescription,
      paidAmount: pricing || 0,
      timestamp: new Date().toISOString(),
    }
    
    localStorage.setItem("pending_service_post", JSON.stringify(postingData))
    
    toast.success("Payment successful! Redirecting to service creation...")
    
    // Redirect to service creation page after a short delay
    setTimeout(() => {
      onClose()
      if (user) {
        // User is logged in, go directly to create page
        router.push(`/dashboard/marketing/services/create?serviceType=${selectedService}&fromPayment=true`)
      } else {
        // User not logged in, redirect to login first
        const redirectUrl = encodeURIComponent(`/dashboard/marketing/services/create?serviceType=${selectedService}&fromPayment=true`)
        router.push(`/login?redirect=${redirectUrl}`)
        toast.info("Please log in to complete your service listing")
      }
    }, 2000)
  }

  const handleClose = () => {
    if (step === "payment") {
      toast.info("Payment cancelled")
    }
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen && !showPaymentDialog} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {step === "select" && "Select Service Category"}
              {step === "details" && "Service Details"}
              {step === "success" && "Success!"}
            </DialogTitle>
            <DialogDescription>
              {step === "select" && "Choose the category for your service listing"}
              {step === "details" && "Provide your contact details and service information"}
              {step === "success" && "Your payment was successful"}
            </DialogDescription>
          </DialogHeader>

          {step === "select" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Service Category *</Label>
                <Select value={selectedService} onValueChange={handleServiceSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading pricing...</span>
                </div>
              )}

              {!loading && pricing !== null && (
                <div className="bg-muted p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Posting Fee:</span>
                    <span className="text-2xl font-bold text-primary">
                      {pricing === 0 ? "FREE" : `KSh ${pricing.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>✓ Your service will be visible to thousands of users</p>
                    <p>✓ Direct contact information displayed</p>
                    <p>✓ Your phone number will be automatically whitelisted</p>
                    <p>✓ Instant activation after payment</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleContinue} 
                  disabled={!selectedService || pricing === null}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-6">
              {isWhitelistedUser && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 rounded-lg flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      You're whitelisted!
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      No payment required - you can post for free
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (M-Pesa) *</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0712345678 or +254712345678"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
                  />
                  {isCheckingWhitelist && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  This number will be used for payment and will be whitelisted for free access
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Professional Plumbing Services"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Brief Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your service..."
                  rows={4}
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You'll be able to add more details, images, and videos after payment
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  After payment, you'll be redirected to complete your service listing with full details, images, and contact information.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("select")} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmitDetails}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  {pricing === 0 || isWhitelistedUser ? "Submit (Free)" : `Pay KSh ${pricing?.toFixed(2)}`}
                  {isWhitelistedUser ? <Shield className="ml-2 h-4 w-4" /> : <CreditCard className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="space-y-6 text-center py-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                <p className="text-muted-foreground">
                  Your phone number has been whitelisted. Redirecting you to complete your service listing...
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Redirecting...</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {showPaymentDialog && pricing && pricing > 0 && (
        <MpesaPaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => {
            setShowPaymentDialog(false)
            setStep("details")
          }}
          onSuccess={handlePaymentSuccess}
          serviceType={selectedService}
          actionType="PostService"
          amount={pricing}
          phoneNumber={phoneNumber}
        />
      )}
    </>
  )
}
