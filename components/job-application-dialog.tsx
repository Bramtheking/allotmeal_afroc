"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle2, Briefcase, Upload } from "lucide-react"
import { toast } from "sonner"
import { getServicePricing } from "@/lib/mpesa-firebase"
import { MpesaPaymentDialog } from "./mpesa-payment-dialog"
import { useAuth } from "@/lib/auth-context"

interface JobApplicationDialogProps {
  isOpen: boolean
  onClose: () => void
  jobTitle: string
  jobId: string
}

export function JobApplicationDialog({ isOpen, onClose, jobTitle, jobId }: JobApplicationDialogProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<"form" | "payment" | "success">("form")
  const [loading, setLoading] = useState(false)
  const [applicationFee, setApplicationFee] = useState<number | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  
  // Application form data
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadApplicationFee()
      // Pre-fill user data if available
      if (user) {
        setEmail(user.email || "")
        setFullName(user.displayName || "")
      }
    }
  }, [isOpen, user])

  const loadApplicationFee = async () => {
    setLoading(true)
    try {
      const pricing = await getServicePricing("jobs")
      console.log("Job application pricing loaded:", pricing)
      
      if (pricing && pricing.jobApplicationAmount !== undefined) {
        setApplicationFee(pricing.jobApplicationAmount)
        console.log("Job application fee set to:", pricing.jobApplicationAmount)
      } else {
        console.log("No job application amount configured, defaulting to 0")
        setApplicationFee(0) // Free if not configured
      }
    } catch (error) {
      console.error("Error loading application fee:", error)
      setApplicationFee(0) // Default to free on error
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitApplication = () => {
    // Validate form
    if (!fullName || !email || !phone) {
      toast.error("Please fill in all required fields")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    const phoneRegex = /^(\+?254|0)[17]\d{8}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      toast.error("Please enter a valid Kenyan phone number")
      return
    }

    if (applicationFee === 0) {
      // Free application - submit directly
      submitApplication()
    } else {
      // Paid application - show payment dialog
      setStep("payment")
      setShowPaymentDialog(true)
    }
  }

  const submitApplication = async () => {
    setLoading(true)
    try {
      let resumeUrl = null
      
      // Upload resume to Cloudinary if provided
      if (resumeFile) {
        try {
          const { uploadToCloudinary } = await import("@/lib/cloudinary")
          resumeUrl = await uploadToCloudinary(resumeFile, "raw") // 'raw' for documents
          console.log("Resume uploaded:", resumeUrl)
        } catch (uploadError) {
          console.error("Error uploading resume:", uploadError)
          toast.error("Failed to upload resume. Submitting without it...")
        }
      }
      
      const applicationData = {
        jobId,
        jobTitle,
        fullName,
        email,
        phone,
        coverLetter,
        resumeUrl, // Cloudinary URL
        resumeFileName: resumeFile?.name || null,
        applicationFee: applicationFee || 0,
        appliedAt: new Date().toISOString(),
        userId: user?.uid || null,
        status: "pending",
        read: false, // Track if admin has read it
      }

      console.log("Application submitted:", applicationData)
      
      // Save to Firebase
      const { getFirebaseDb } = await import("@/lib/firebase")
      const { addDoc, collection } = await import("firebase/firestore")
      
      const db = await getFirebaseDb()
      if (db) {
        await addDoc(collection(db, "job_applications"), applicationData)
        console.log("Application saved to Firebase")
      } else {
        console.log("Firebase not available, application data logged only")
      }
      
      setStep("success")
      toast.success("Application submitted successfully!")
      
      setTimeout(() => {
        onClose()
        resetForm()
      }, 3000)
    } catch (error) {
      console.error("Error submitting application:", error)
      toast.error("Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    setShowPaymentDialog(false)
    submitApplication()
  }

  const resetForm = () => {
    setStep("form")
    setFullName("")
    setEmail("")
    setPhone("")
    setCoverLetter("")
    setResumeFile(null)
  }

  const handleClose = () => {
    if (step === "payment") {
      toast.info("Application cancelled")
    }
    onClose()
    resetForm()
  }

  return (
    <>
      <Dialog open={isOpen && !showPaymentDialog} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {step === "form" && "Apply for Job"}
              {step === "success" && "Application Submitted!"}
            </DialogTitle>
            <DialogDescription>
              {step === "form" && `Applying for: ${jobTitle}`}
              {step === "success" && "Your application has been received"}
            </DialogDescription>
          </DialogHeader>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading...</span>
            </div>
          )}

          {!loading && step === "form" && (
            <div className="space-y-6">
              {applicationFee !== null && applicationFee > 0 && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Application Fee:</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      KSh {applicationFee.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Payment will be required after submitting your application details
                  </p>
                </div>
              )}

              {applicationFee === 0 && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    ✓ Free application - No payment required
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0712345678 or +254712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Tell us why you're a great fit for this position..."
                  rows={6}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume/CV (Optional)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("resume")?.click()}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : resumeFile ? (
                        resumeFile.name
                      ) : (
                        "Upload Resume"
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      PDF, DOC, or DOCX (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitApplication}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
                >
                  {applicationFee === 0 ? "Submit Application" : `Continue to Payment`}
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
                <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                <p className="text-muted-foreground">
                  Your application for <strong>{jobTitle}</strong> has been successfully submitted.
                  The employer will review your application and contact you if selected.
                </p>
              </div>
              <Button onClick={handleClose} className="mt-4">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {showPaymentDialog && applicationFee && applicationFee > 0 && (
        <MpesaPaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => {
            setShowPaymentDialog(false)
            setStep("form")
          }}
          onSuccess={handlePaymentSuccess}
          serviceType="jobs"
          actionType="JobApplication"
          amount={applicationFee}
          phoneNumber={phone}
        />
      )}
    </>
  )
}
