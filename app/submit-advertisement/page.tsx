"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { collection, addDoc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { ArrowLeft, Upload, X, Loader2, CheckCircle2, Sparkles, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { MpesaPaymentDialog } from "@/components/mpesa-payment-dialog"

const DURATION_PRICING = {
  "1day": { label: "1 Day", price: 200, days: 1 },
  "1week": { label: "1 Week", price: 300, days: 7 },
  "1month": { label: "1 Month", price: 1000, days: 30 },
  "6months": { label: "6 Months", price: 5000, days: 180 },
  "1year": { label: "1 Year", price: 10000, days: 365 },
}

export default function SubmitAdvertisementPage() {
  const router = useRouter()
  const [step, setStep] = useState<"form" | "payment" | "success">("form")
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [pendingAdData, setPendingAdData] = useState<any>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    contact: "",
    location: "",
    website: "",
    duration: "1week",
    placement: "services", // Default placement
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) {
      console.log("No files selected")
      return
    }

    console.log(`Attempting to upload ${files.length} image(s)...`)

    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed. Please select fewer images.")
      e.target.value = "" // Reset input
      return
    }

    setUploadingImages(true)
    try {
      console.log("Uploading to Cloudinary...")
      const uploadPromises = Array.from(files).map((file) => {
        console.log(`Uploading file: ${file.name}, size: ${file.size} bytes`)
        return uploadToCloudinary(file, "image")
      })
      const results = await Promise.all(uploadPromises)
      console.log("Upload successful, results:", results)
      setImages((prev) => [...prev, ...results])
      toast.success(`${files.length} image(s) uploaded successfully!`)
      e.target.value = "" // Reset input for next upload
    } catch (error) {
      console.error("Error uploading images:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      toast.error(`Failed to upload images: ${errorMessage}`)
      e.target.value = "" // Reset input
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted", formData)

    // Validate form
    if (!formData.title || !formData.description || !formData.company || !formData.contact) {
      toast.error("Please fill in all required fields")
      console.log("Validation failed: Missing required fields")
      return
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image")
      console.log("Validation failed: No images")
      return
    }

    console.log("Validation passed, preparing advertisement data...")

    try {
      // Calculate dates
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + DURATION_PRICING[formData.duration as keyof typeof DURATION_PRICING].days)

      // Prepare advertisement data
      const adData = {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        contact: formData.contact,
        location: formData.location || "",
        website: formData.website || "",
        images: images,
        adType: "featured" as const,
        placement: formData.placement,
        status: "pending" as const,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isSelfService: true,
        duration: formData.duration,
        paymentAmount: DURATION_PRICING[formData.duration as keyof typeof DURATION_PRICING].price,
        paymentStatus: "pending" as const,
        autoExpires: true,
        createdBy: "self-service",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clicks: 0,
        impressions: 0,
      }

      console.log("Advertisement data prepared:", adData)
      console.log("Opening payment dialog...")

      setPendingAdData(adData)
      setShowPaymentDialog(true)
    } catch (error) {
      console.error("Error preparing advertisement:", error)
      toast.error("An error occurred. Please try again.")
    }
  }

  const handlePaymentSuccess = async () => {
    setLoading(true)
    try {
      const db = await getFirebaseDb()
      if (!db) throw new Error("Database not available")

      // Update payment status to completed and status to active
      const finalAdData = {
        ...pendingAdData,
        paymentStatus: "completed",
        status: "active",
      }

      await addDoc(collection(db, "advertisements"), finalAdData)
      
      setShowPaymentDialog(false)
      setStep("success")
      toast.success("Advertisement submitted successfully!")
    } catch (error) {
      console.error("Error creating advertisement:", error)
      toast.error("Failed to create advertisement")
    } finally {
      setLoading(false)
    }
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-green-950/30 dark:via-gray-950 dark:to-blue-950/30 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Advertisement Submitted Successfully!
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Your advertisement has been submitted and will appear on the site shortly. You will receive a confirmation
              via the contact details provided.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button asChild>
                <Link href="/advertisements">View Advertisements</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/30 dark:via-gray-950 dark:to-purple-950/30">
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Advertise with Us
            </h1>
            <p className="text-muted-foreground">Reach thousands of potential customers</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Advertisement Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Advertisement Details
              </CardTitle>
              <CardDescription>Tell us about your business or product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Advertisement Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter a catchy title for your advertisement"
                  required
                  className={!formData.title ? "border-red-200" : ""}
                />
                {!formData.title && (
                  <p className="text-xs text-red-500">This field is required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">
                  Company/Business Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Your company name"
                  required
                  className={!formData.company ? "border-red-200" : ""}
                />
                {!formData.company && (
                  <p className="text-xs text-red-500">This field is required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your product or service. What makes it special?"
                  rows={5}
                  required
                  className={!formData.description ? "border-red-200" : ""}
                />
                {!formData.description && (
                  <p className="text-xs text-red-500">This field is required</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Use *text* for bold, _text_ for italic, __text__ for underline
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">
                    Contact Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => handleInputChange("contact", e.target.value)}
                    placeholder="0712345678"
                    required
                    className={!formData.contact ? "border-red-200" : ""}
                  />
                  {!formData.contact && (
                    <p className="text-xs text-red-500">This field is required</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Upload images of your product or service (Max 5 images)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Label htmlFor="images" className="cursor-pointer">
                    <div className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg transition-all ${
                      images.length >= 5 
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50' 
                        : uploadingImages
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    }`}>
                      <Upload className="h-5 w-5" />
                      <span className="font-medium">
                        {uploadingImages ? 'Uploading...' : images.length >= 5 ? 'Max images reached' : 'Choose Images'}
                      </span>
                    </div>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={images.length >= 5 || uploadingImages}
                    />
                  </Label>
                  {uploadingImages && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="font-medium">Uploading to cloud...</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-muted-foreground">{images.length}/5 images</span>
                </div>
                
                {images.length === 0 && (
                  <div className="text-sm text-red-500 flex items-center gap-2">
                    <span className="font-semibold">⚠</span>
                    <span>At least 1 image is required</span>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Click the button above to select images from your device. Supported formats: JPG, PNG, GIF
                </p>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Advertisement image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ad Placement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Ad Placement
              </CardTitle>
              <CardDescription>Choose where your advertisement will appear on the website</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={formData.placement} onValueChange={(value) => handleInputChange("placement", value)}>
                <div className="space-y-3">
                  <div>
                    <RadioGroupItem value="homepage" id="homepage" className="peer sr-only" />
                    <Label
                      htmlFor="homepage"
                      className="flex items-start gap-3 rounded-lg border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50 dark:peer-data-[state=checked]:bg-purple-950/20 cursor-pointer transition-all"
                    >
                      <div className="flex-1">
                        <span className="text-lg font-semibold block mb-1">Homepage (Below Featured Video)</span>
                        <span className="text-sm text-muted-foreground">Prime position right after the hero video, maximum visibility</span>
                      </div>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="services" id="services" className="peer sr-only" />
                    <Label
                      htmlFor="services"
                      className="flex items-start gap-3 rounded-lg border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50 dark:peer-data-[state=checked]:bg-purple-950/20 cursor-pointer transition-all"
                    >
                      <div className="flex-1">
                        <span className="text-lg font-semibold block mb-1">Featured Advertisements Section (Default)</span>
                        <span className="text-sm text-muted-foreground">Main featured advertisements section below services</span>
                      </div>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="sidebar" id="sidebar" className="peer sr-only" />
                    <Label
                      htmlFor="sidebar"
                      className="flex items-start gap-3 rounded-lg border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50 dark:peer-data-[state=checked]:bg-purple-950/20 cursor-pointer transition-all"
                    >
                      <div className="flex-1">
                        <span className="text-lg font-semibold block mb-1">Sidebar Banner</span>
                        <span className="text-sm text-muted-foreground">Visible on service detail pages and blog posts</span>
                      </div>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="footer" id="footer" className="peer sr-only" />
                    <Label
                      htmlFor="footer"
                      className="flex items-start gap-3 rounded-lg border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50 dark:peer-data-[state=checked]:bg-purple-950/20 cursor-pointer transition-all"
                    >
                      <div className="flex-1">
                        <span className="text-lg font-semibold block mb-1">Footer Banner</span>
                        <span className="text-sm text-muted-foreground">Appears at the bottom of every page</span>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Duration & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Select Duration
              </CardTitle>
              <CardDescription>Choose how long you want your advertisement to run</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(DURATION_PRICING).map(([key, { label, price }]) => (
                    <div key={key}>
                      <RadioGroupItem value={key} id={key} className="peer sr-only" />
                      <Label
                        htmlFor={key}
                        className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950/20 cursor-pointer transition-all"
                      >
                        <span className="text-lg font-semibold">{label}</span>
                        <div className="flex items-center gap-1 text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                          <DollarSign className="h-5 w-5" />
                          KSh {price.toLocaleString()}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Total Amount</h4>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      KSh {DURATION_PRICING[formData.duration as keyof typeof DURATION_PRICING].price.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your advertisement will run for{" "}
                      {DURATION_PRICING[formData.duration as keyof typeof DURATION_PRICING].label.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {/* Show validation hints */}
            {(!formData.title || !formData.description || !formData.company || !formData.contact || images.length === 0) && (
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                <p className="font-semibold mb-1">Required fields:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {!formData.title && <li>Advertisement Title</li>}
                  {!formData.company && <li>Company/Business Name</li>}
                  {!formData.description && <li>Description</li>}
                  {!formData.contact && <li>Contact Number</li>}
                  {images.length === 0 && <li>At least 1 image</li>}
                </ul>
              </div>
            )}
            
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={loading || uploadingImages || !formData.title || !formData.description || !formData.company || !formData.contact || images.length === 0}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment
                    <DollarSign className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* M-Pesa Payment Dialog */}
      {showPaymentDialog && pendingAdData && (
        <MpesaPaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          onSuccess={handlePaymentSuccess}
          serviceType="advertisement"
          actionType="Continue"
          amount={pendingAdData.paymentAmount}
        />
      )}
    </div>
  )
}
