"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Advertisement } from "@/lib/types"
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface EditAdvertisementPageProps {
  params: {
    id: string
  }
}

export default function EditAdvertisement({ params }: EditAdvertisementPageProps) {
  const { user, userRole } = useAuth()
  const router = useRouter()
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [uploadingVideos, setUploadingVideos] = useState(false)
  const [videos, setVideos] = useState<string[]>([])
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>([])

  const [formData, setFormData] = useState<Partial<Advertisement>>({
    title: "",
    description: "",
    adType: "banner",
    placement: "homepage",
    priority: "medium",
    startDate: "",
    endDate: "",
    company: "",
    website: "",
    contact: "",
    price: "",
    location: "",
    status: "active",
  })

  useEffect(() => {
    if (params.id) {
      fetchAdvertisement()
    }
  }, [params.id])

  const fetchAdvertisement = async () => {
    try {
      const db = await getFirebaseDb()
      if (!db) return

      const adDoc = await getDoc(doc(db, "advertisements", params.id))
      if (!adDoc.exists()) {
        toast.error("Advertisement not found")
        router.push("/dashboard/marketing")
        return
      }

      const adData = { id: adDoc.id, ...adDoc.data() } as Advertisement

      // Check if user can edit this advertisement
      const isAdmin = userRole === "admin"
      const isMarketing = userRole === "marketing"
      const isOwner = adData.createdBy === user?.uid

      if (!isAdmin && !isMarketing && !isOwner) {
        toast.error("You don't have permission to edit this advertisement")
        router.push("/dashboard/marketing")
        return
      }

      setAdvertisement(adData)
      setFormData({
        title: adData.title || "",
        description: adData.description || "",
        adType: adData.adType || "banner",
        placement: adData.placement || "homepage",
        priority: adData.priority || "medium",
        startDate: adData.startDate || "",
        endDate: adData.endDate || "",
        company: adData.company || "",
        website: adData.website || "",
        contact: adData.contact || "",
        price: adData.price || "",
        location: adData.location || "",
        status: adData.status || "active",
      })
      setImages(adData.images || [])
      setVideos(adData.videos || [])
      setYoutubeLinks(adData.youtubeLinks || [])
    } catch (error) {
      console.error("Error fetching advertisement:", error)
      toast.error("Failed to fetch advertisement")
      router.push("/dashboard/marketing")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof Advertisement, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploadingImages(true)
    try {
      const uploadPromises = Array.from(files).map((file) => uploadToCloudinary(file, "image"))
      const results = await Promise.all(uploadPromises)
      const newImageUrls = results
      setImages((prev) => [...prev, ...newImageUrls])
      toast.success(`${files.length} image(s) uploaded successfully`)
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error("Failed to upload images")
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploadingVideos(true)
    try {
      const uploadPromises = Array.from(files).map((file) => uploadToCloudinary(file, "video"))
      const results = await Promise.all(uploadPromises)
      const newVideoUrls = results
      setVideos((prev) => [...prev, ...newVideoUrls])
      toast.success(`${files.length} video(s) uploaded successfully`)
    } catch (error) {
      console.error("Error uploading videos:", error)
      toast.error("Failed to upload videos")
    } finally {
      setUploadingVideos(false)
    }
  }

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index))
  }

  const addYoutubeLink = () => {
    const link = prompt("Enter YouTube Link:")
    if (link) {
      setYoutubeLinks((prev) => [...prev, link])
    }
  }

  const removeYoutubeLink = (index: number) => {
    setYoutubeLinks((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !advertisement) return

    setSubmitting(true)
    try {
      const db = await getFirebaseDb()
      if (!db) throw new Error("Database not available")

      // Create clean data object with only defined values
      const cleanFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== undefined && value !== "")
      )

      const updateData: any = {
        ...cleanFormData,
        images: images || [],
        videos: videos || [],
        youtubeLinks: youtubeLinks || [],
        updatedAt: new Date().toISOString(),
      }

      // Remove any remaining undefined fields to prevent Firestore errors
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key]
        }
      })

      await updateDoc(doc(db, "advertisements", params.id), updateData)
      toast.success("Advertisement updated successfully!")
      router.push("/dashboard/marketing")
    } catch (error) {
      console.error("Error updating advertisement:", error)
      toast.error("Failed to update advertisement")
    } finally {
      setSubmitting(false)
    }
  }

  if (!user || (userRole !== "marketing" && userRole !== "admin")) {
    return <div>Access denied</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-yellow-950/30 dark:via-gray-950 dark:to-blue-950/30">
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (!advertisement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-yellow-950/30 dark:via-gray-950 dark:to-blue-950/30">
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Advertisement not found</h1>
            <Button asChild className="mt-4">
              <Link href="/dashboard/marketing">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-yellow-950/30 dark:via-gray-950 dark:to-blue-950/30">
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/marketing">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Advertisement</h1>
            <p className="text-muted-foreground">Update advertisement details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update the essential details about your advertisement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Advertisement Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter advertisement title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your advertisement"
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advertisement Details</CardTitle>
              <CardDescription>Configure advertisement type and placement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="adType">Advertisement Type *</Label>
                  <Select value={formData.adType} onValueChange={(value) => handleInputChange("adType", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ad type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="sponsored">Sponsored</SelectItem>
                      <SelectItem value="popup">Popup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placement">Placement</Label>
                  <Input
                    id="placement"
                    value={formData.placement}
                    onChange={(e) => handleInputChange("placement", e.target.value)}
                    placeholder="e.g., homepage, sidebar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact & Location</CardTitle>
              <CardDescription>Provide contact information and location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => handleInputChange("contact", e.target.value)}
                    placeholder="Phone or email"
                  />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price/Budget</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="e.g., $500/month"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Upload and manage images for your advertisement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="images" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>Upload Images</span>
                  </div>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </Label>
                {uploadingImages && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </div>
                )}
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Advertisement image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
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

          {/* Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
              <CardDescription>Upload and manage videos for your advertisement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="videos" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>Upload Videos</span>
                  </div>
                  <Input
                    id="videos"
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </Label>
                {uploadingVideos && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </div>
                )}
              </div>

              {videos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {videos.map((video, index) => (
                    <div key={index} className="relative group">
                      <video
                        src={video}
                        className="w-full h-24 object-cover rounded-lg"
                        title={`Advertisement video ${index + 1}`}
                        controls
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeVideo(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* YouTube Links */}
          <Card>
            <CardHeader>
              <CardTitle>YouTube Links</CardTitle>
              <CardDescription>Add YouTube video links for your advertisement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" onClick={addYoutubeLink} variant="outline">
                Add YouTube Link
              </Button>
              {youtubeLinks.length > 0 && (
                <div className="space-y-2">
                  {youtubeLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={link} readOnly className="flex-1" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeYoutubeLink(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
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
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Advertisement...
                </>
              ) : (
                "Update Advertisement"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}