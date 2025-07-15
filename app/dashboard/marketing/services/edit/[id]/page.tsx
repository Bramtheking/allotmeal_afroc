"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import type { Service } from "@/lib/types"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { toast } from "sonner"
import { ArrowLeft, X, Plus, Play, ImageIcon, Video } from "lucide-react"
import Link from "next/link"

const serviceTypes = [
  { value: "agriculture", label: "Agriculture" },
  { value: "construction", label: "Construction" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health" },
  { value: "hotel-industry", label: "Hotel & Industry" },
  { value: "jobs", label: "Jobs" },
  { value: "sermon", label: "Sermon" },
  { value: "sme-products", label: "SME Products" },
  { value: "tenders", label: "Tenders" },
  { value: "transport", label: "Transport" },
]

interface EditServicePageProps {
  params: {
    id: string
  }
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadingVideos, setUploadingVideos] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceType: "",
    company: "",
    location: "",
    price: "",
    contactInfo: "",
    images: [] as string[],
    videos: [] as string[],
    youtubeLinks: [] as string[],
  })

  const [newYouTubeLink, setNewYouTubeLink] = useState("")

  useEffect(() => {
    if (user && params.id) {
      fetchService()
    }
  }, [user, params.id])

  const fetchService = async () => {
    try {
      const db = await getFirebaseDb()
      if (!db) return

      const serviceDoc = await getDoc(doc(db, "services", params.id))
      if (!serviceDoc.exists()) {
        toast.error("Service not found")
        router.push("/dashboard/marketing")
        return
      }

      const serviceData = { id: serviceDoc.id, ...serviceDoc.data() } as Service

      // Check if user can edit this service
      const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
      const isMarketing = user?.email && user.email.includes("@") // Basic check for marketing users
      const isOwner = serviceData.userId === user?.uid

      if (!isAdmin && !isMarketing && !isOwner) {
        toast.error("You don't have permission to edit this service")
        router.push("/dashboard/marketing")
        return
      }

      setService(serviceData)
      setFormData({
        title: serviceData.title || "",
        description: serviceData.description || "",
        serviceType: serviceData.serviceType || "",
        company: serviceData.company || "",
        location: serviceData.location || "",
        price: serviceData.price || "",
        contactInfo: serviceData.contactInfo || "",
        images: serviceData.images || [],
        videos: serviceData.videos || [],
        youtubeLinks: serviceData.youtubeLinks || [],
      })
    } catch (error) {
      console.error("Error fetching service:", error)
      toast.error("Failed to fetch service")
      router.push("/dashboard/marketing")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (files: FileList) => {
    if (!files.length) return

    setUploadingImages(true)
    try {
      const uploadPromises = Array.from(files).map((file) => uploadToCloudinary(file, "image"))
      const imageUrls = await Promise.all(uploadPromises)

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }))

      toast.success(`${imageUrls.length} image(s) uploaded successfully`)
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error("Failed to upload images")
    } finally {
      setUploadingImages(false)
    }
  }

  const handleVideoUpload = async (files: FileList) => {
    if (!files.length) return

    setUploadingVideos(true)
    try {
      const uploadPromises = Array.from(files).map((file) => uploadToCloudinary(file, "video"))
      const videoUrls = await Promise.all(uploadPromises)

      setFormData((prev) => ({
        ...prev,
        videos: [...prev.videos, ...videoUrls],
      }))

      toast.success(`${videoUrls.length} video(s) uploaded successfully`)
    } catch (error) {
      console.error("Error uploading videos:", error)
      toast.error("Failed to upload videos")
    } finally {
      setUploadingVideos(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const removeVideo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }))
  }

  const addYouTubeLink = () => {
    if (!newYouTubeLink.trim()) return

    setFormData((prev) => ({
      ...prev,
      youtubeLinks: [...prev.youtubeLinks, newYouTubeLink.trim()],
    }))
    setNewYouTubeLink("")
  }

  const removeYouTubeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      youtubeLinks: prev.youtubeLinks.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !service) return

    setSubmitting(true)
    try {
      const db = await getFirebaseDb()
      if (!db) return

      const updateData = {
        ...formData,
        updatedAt: new Date(),
      }

      await updateDoc(doc(db, "services", params.id), updateData)

      toast.success("Service updated successfully!")
      router.push("/dashboard/marketing")
    } catch (error) {
      console.error("Error updating service:", error)
      toast.error("Failed to update service")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading service...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <Button asChild>
            <Link href="/dashboard/marketing">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/marketing">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Service</h1>
            <p className="text-muted-foreground">Update your service information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update the basic details of your service</CardDescription>
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
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => handleInputChange("serviceType", value)}
                  >
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

                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Enter location"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (Optional)</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="e.g., $100, Free, Contact for pricing"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactInfo">Contact Information</Label>
                  <Input
                    id="contactInfo"
                    value={formData.contactInfo}
                    onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                    placeholder="Phone, email, or other contact info"
                  />
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

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>Add images and videos to showcase your service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Images Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Images</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImages}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("image-upload")?.click()}
                      disabled={uploadingImages}
                    >
                      {uploadingImages ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Images
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Service image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
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
                        <div className="absolute bottom-1 left-1">
                          <Badge variant="secondary" className="text-xs">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            IMG
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Videos</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => e.target.files && handleVideoUpload(e.target.files)}
                      className="hidden"
                      id="video-upload"
                      disabled={uploadingVideos}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("video-upload")?.click()}
                      disabled={uploadingVideos}
                    >
                      {uploadingVideos ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Videos
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {formData.videos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.videos.map((video, index) => (
                      <div key={index} className="relative group">
                        <video src={video} className="w-full h-24 object-cover rounded-lg border" muted />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeVideo(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-6 w-6 text-white drop-shadow-lg" />
                        </div>
                        <div className="absolute bottom-1 left-1">
                          <Badge variant="secondary" className="text-xs">
                            <Video className="h-3 w-3 mr-1" />
                            VID
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* YouTube Links Section */}
              <div className="space-y-4">
                <Label>YouTube Links</Label>
                <div className="flex gap-2">
                  <Input
                    value={newYouTubeLink}
                    onChange={(e) => setNewYouTubeLink(e.target.value)}
                    placeholder="Paste YouTube URL here"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addYouTubeLink())}
                  />
                  <Button type="button" variant="outline" onClick={addYouTubeLink}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.youtubeLinks.length > 0 && (
                  <div className="space-y-2">
                    {formData.youtubeLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                        <div className="flex-1 text-sm truncate">{link}</div>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeYouTubeLink(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/marketing">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Updating...
                </>
              ) : (
                "Update Service"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
