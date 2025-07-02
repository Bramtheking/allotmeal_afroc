"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { collection, addDoc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { Service } from "@/lib/types"
import { ArrowLeft, Upload, X, Loader2, Plus } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function CreateService() {
  const { user, userRole } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [uploadingVideos, setUploadingVideos] = useState(false)
  const [videos, setVideos] = useState<string[]>([])
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [requirements, setRequirements] = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [services, setServices] = useState<string[]>([])

  const [formData, setFormData] = useState<Partial<Service>>({
    title: "",
    description: "",
    serviceType: "agriculture",
    company: "",
    location: "",
    contact: "",
    email: "",
    website: "",
    price: "",
    rating: 5,
    status: "active",
  })

  const handleInputChange = (field: keyof Service, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploadingImages(true)
    try {
      const uploadPromises = Array.from(files).map((file) => uploadToCloudinary(file))
      const results = await Promise.all(uploadPromises)
      const newImageUrls = results.map((result) => result.secure_url)
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
      const newVideoUrls = results.map((result) => result.secure_url)
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

  const addFeature = () => {
    const feature = prompt("Enter Feature:")
    if (feature) {
      setFeatures((prev) => [...prev, feature])
    }
  }

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  const addRequirement = () => {
    const requirement = prompt("Enter Requirement:")
    if (requirement) {
      setRequirements((prev) => [...prev, requirement])
    }
  }

  const removeRequirement = (index: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index))
  }

  const addAmenity = () => {
    const amenity = prompt("Enter Amenity:")
    if (amenity) {
      setAmenities((prev) => [...prev, amenity])
    }
  }

  const removeAmenity = (index: number) => {
    setAmenities((prev) => prev.filter((_, i) => i !== index))
  }

  const addService = () => {
    const service = prompt("Enter Service:")
    if (service) {
      setServices((prev) => [...prev, service])
    }
  }

  const removeService = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const db = await getFirebaseDb()
      if (!db) throw new Error("Database not available")

      const serviceData: Omit<Service, "id"> = {
        ...formData,
        images,
        videos,
        youtubeLinks,
        features,
        requirements,
        amenities,
        services,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
      } as Omit<Service, "id">

      await addDoc(collection(db, "services"), serviceData)
      toast.success("Service created successfully!")
      router.push("/dashboard/marketing")
    } catch (error) {
      console.error("Error creating service:", error)
      toast.error("Failed to create service")
    } finally {
      setLoading(false)
    }
  }

  if (!user || (userRole !== "marketing" && userRole !== "admin")) {
    return <div>Access denied</div>
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
            <h1 className="text-3xl font-bold">Create Service</h1>
            <p className="text-muted-foreground">Create a new service listing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>Enter the basic information about your service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="hotel-industry">Hotel & Industry</SelectItem>
                      <SelectItem value="jobs">Jobs</SelectItem>
                      <SelectItem value="sermon">Sermon</SelectItem>
                      <SelectItem value="sme-products">SME Products</SelectItem>
                      <SelectItem value="tenders">Tenders</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
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
                  placeholder="Describe your service (you can use *bold*, _italic_, __underline__ formatting)"
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Use *text* for bold, _text_ for italic, __text__ for underline
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Company name"
                    required
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How customers can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => handleInputChange("contact", e.target.value)}
                    placeholder="+1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contact@company.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="e.g., $100, Contact for pricing"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Upload images to showcase your service</CardDescription>
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
                        alt={`Service image ${index + 1}`}
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

          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
              <CardDescription>Upload videos to showcase your service</CardDescription>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {videos.map((video, index) => (
                    <div key={index} className="relative group">
                      <video
                        src={video || "/placeholder.svg"}
                        className="w-full h-24 object-cover rounded-lg"
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

          <Card>
            <CardHeader>
              <CardTitle>YouTube Links</CardTitle>
              <CardDescription>Add YouTube links for your service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" variant="secondary" onClick={addYoutubeLink}>
                <Plus className="h-4 w-4 mr-2" />
                Add YouTube Link
              </Button>

              {youtubeLinks.length > 0 && (
                <div className="space-y-2">
                  {youtubeLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-blue-600 hover:underline"
                      >
                        {link}
                      </a>
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeYoutubeLink(index)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Add key features of your service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" variant="secondary" onClick={addFeature}>
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>

              {features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full"
                    >
                      <span className="text-sm">{feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Add any requirements for your service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" variant="secondary" onClick={addRequirement}>
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>

              {requirements.length > 0 && (
                <div className="space-y-2">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <span className="text-sm">{requirement}</span>
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeRequirement(index)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>Add amenities available with your service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" variant="secondary" onClick={addAmenity}>
                <Plus className="h-4 w-4 mr-2" />
                Add Amenity
              </Button>

              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full"
                    >
                      <span className="text-sm">{amenity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                        onClick={() => removeAmenity(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Services</CardTitle>
              <CardDescription>Add any additional services you provide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" variant="secondary" onClick={addService}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>

              {services.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full"
                    >
                      <span className="text-sm">{service}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                        onClick={() => removeService(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/marketing">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading || !formData.title || !formData.description || !formData.company}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Service"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
