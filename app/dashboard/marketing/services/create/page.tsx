"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  X,
  Plus,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  Globe,
  Play,
  ImageIcon,
  Video,
  Youtube,
  Loader2,
} from "lucide-react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { uploadToCloudinary } from "@/lib/cloudinary"

const serviceTypes = [
  { value: "agriculture", label: "Agriculture" },
  { value: "construction", label: "Construction" },
  { value: "education-school", label: "Education - School" },
  { value: "education-college", label: "Education - College" },
  { value: "education-university", label: "Education - University" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health" },
  { value: "hotel-industry", label: "Hotel & Industry" },
  { value: "jobs", label: "Jobs" },
  { value: "sermon", label: "Sermon" },
  { value: "sme-products", label: "SME Products" },
  { value: "tenders", label: "Tenders" },
  { value: "transport", label: "Transport" },
]

export default function CreateService() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceType: "",
    company: "",
    location: "Kenya",
    town: "",
    price: "",
    contactPhone: "",
    contactEmail: "",
    website: "",
    tags: [] as string[],
    images: [] as string[],
    videos: [] as string[],
    youtubeLinks: [] as string[],
  })

  // Kenyan towns list (alphabetically sorted)
  const kenyanTowns = [
    "Bungoma", "Eldoret", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kakamega", "Kericho",
    "Kilifi", "Kisii", "Kisumu", "Kitale", "Kitui", "Lamu", "Lodwar", "Machakos",
    "Malindi", "Mandera", "Meru", "Migori", "Mombasa", "Mumias", "Nairobi", "Naivasha",
    "Nakuru", "Nanyuki", "Narok", "Nyeri", "Thika", "Voi", "Wajir", "Webuye"
  ]
  const [currentTag, setCurrentTag] = useState("")
  const [currentYouTubeLink, setCurrentYouTubeLink] = useState("")

  // Check for pending service post from payment
  useEffect(() => {
    const pendingPost = localStorage.getItem("pending_service_post")
    if (pendingPost) {
      try {
        const postData = JSON.parse(pendingPost)
        setFormData(prev => ({
          ...prev,
          serviceType: postData.serviceType || "",
          title: postData.serviceTitle || "",
          description: postData.serviceDescription || "",
          contactPhone: postData.phoneNumber || "",
        }))
        
        // Auto-whitelist the phone number
        if (postData.phoneNumber && user) {
          whitelistPhoneNumber(postData.phoneNumber)
        }
        
        // Clear the pending post
        localStorage.removeItem("pending_service_post")
        
        toast.success("Your payment was successful! Complete your service details below.")
      } catch (error) {
        console.error("Error loading pending service post:", error)
      }
    }
  }, [user])

  const whitelistPhoneNumber = async (phoneNumber: string) => {
    try {
      const { addToWhitelist } = await import("@/lib/mpesa-firebase")
      await addToWhitelist(
        {
          type: "phone",
          value: phoneNumber,
          addedAt: new Date().toISOString(),
          addedBy: user?.uid || "system",
        },
        user?.uid || "system"
      )
      console.log("Phone number whitelisted:", phoneNumber)
    } catch (error) {
      console.error("Error whitelisting phone number:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }))
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleAddYouTubeLink = () => {
    if (currentYouTubeLink.trim() && !formData.youtubeLinks.includes(currentYouTubeLink.trim())) {
      setFormData((prev) => ({
        ...prev,
        youtubeLinks: [...prev.youtubeLinks, currentYouTubeLink.trim()],
      }))
      setCurrentYouTubeLink("")
    }
  }

  const handleRemoveYouTubeLink = (linkToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      youtubeLinks: prev.youtubeLinks.filter((link) => link !== linkToRemove),
    }))
  }

  const handleFileUpload = async (files: FileList, type: "images" | "videos") => {
    if (!files.length) return

    setLoading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const url = await uploadToCloudinary(file, type === "videos" ? "video" : "image")
        setUploadProgress(((index + 1) / files.length) * 100)
        return url
      })

      const uploadedUrls = await Promise.all(uploadPromises)

      setFormData((prev) => ({
        ...prev,
        [type]: [...prev[type], ...uploadedUrls],
      }))

      toast.success(`${files.length} ${type} uploaded successfully`)
    } catch (error) {
      console.error(`Error uploading ${type}:`, error)
      toast.error(`Failed to upload ${type}`)
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const handleRemoveMedia = (url: string, type: "images" | "videos") => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== url),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("You must be logged in to create a service")
      return
    }

    if (!formData.title || !formData.description || !formData.serviceType) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      const db = await getFirebaseDb()
      if (!db) {
        throw new Error("Database not available")
      }

      // Extract base service type and specific type fields
      let baseServiceType = formData.serviceType
      
      // Generate slug for SEO-friendly URLs (will be updated after doc creation)
      const serviceData: any = {
        ...formData,
        serviceType: baseServiceType,
        userId: user.uid,
        userEmail: user.email,
        status: "active",
        views: 0,
        rating: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Handle specific service type fields
      if (formData.serviceType.startsWith("education-")) {
        serviceData.serviceType = "education"
        serviceData.institutionType = formData.serviceType.replace("education-", "")
      }

      // Remove any undefined fields to prevent Firestore errors
      Object.keys(serviceData).forEach(key => {
        if (serviceData[key] === undefined) {
          delete serviceData[key]
        }
      })

      const docRef = await addDoc(collection(db, "services"), serviceData)
      
      // Generate and save slug with document ID
      const { generateUniqueSlug } = await import("@/lib/slug-utils")
      const slug = generateUniqueSlug(formData.title, docRef.id)
      
      const { updateDoc, doc } = await import("firebase/firestore")
      await updateDoc(doc(db, "services", docRef.id), { slug })
      
      toast.success("Service created successfully!")
      router.push("/dashboard/marketing")
    } catch (error) {
      console.error("Error creating service:", error)
      toast.error("Failed to create service")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Service</h1>
        <p className="text-muted-foreground">Add a new service to showcase your offerings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Provide the essential details about your service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter service title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your service in detail"
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Location and Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Pricing</CardTitle>
            <CardDescription>Where is your service available and what does it cost?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Country *</Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                  <SelectTrigger className="text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kenya" className="text-gray-900 dark:text-gray-100">Kenya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="town">Town *</Label>
                <Select value={formData.town} onValueChange={(value) => handleInputChange("town", value)}>
                  <SelectTrigger className="text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Select town" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {kenyanTowns.map((town) => (
                      <SelectItem key={town} value={town} className="text-gray-900 dark:text-gray-100">
                        {town}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="e.g., $100/hour, Free, Contact for quote"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How can customers reach you?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    placeholder="contact@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://example.com"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
            <CardDescription>Upload images and videos to showcase your service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Progress */}
            {loading && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* Image Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                <Label>Images</Label>
              </div>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Drag and drop images here, or click to select</p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files, "images")}
                      className="hidden"
                      id="image-upload"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image-upload")?.click()}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Select Images
                    </Button>
                  </div>
                </div>
              </div>

              {/* Image Preview Grid */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Service image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveMedia(url, "images")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                <Label>Videos</Label>
              </div>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Drag and drop videos here, or click to select</p>
                    <Input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files, "videos")}
                      className="hidden"
                      id="video-upload"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("video-upload")?.click()}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Select Videos
                    </Button>
                  </div>
                </div>
              </div>

              {/* Video Preview Grid */}
              {formData.videos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.videos.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative">
                        <video src={url} className="w-full h-24 object-cover rounded-lg" muted />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveMedia(url, "videos")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* YouTube Links */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5" />
                <Label>YouTube Links</Label>
              </div>
              <div className="flex gap-2">
                <Input
                  value={currentYouTubeLink}
                  onChange={(e) => setCurrentYouTubeLink(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddYouTubeLink())}
                />
                <Button type="button" onClick={handleAddYouTubeLink} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.youtubeLinks.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.youtubeLinks.map((link, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Youtube className="h-3 w-3" />
                      YouTube Video {index + 1}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveYouTubeLink(link)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Add relevant tags to help customers find your service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Enter a tag (e.g., professional, affordable, 24/7)"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Service...
              </>
            ) : (
              "Create Service"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
