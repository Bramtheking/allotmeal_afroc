"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Loader2, Upload, Video, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { uploadToCloudinary } from "@/lib/cloudinary"

export default function VideoManagementPage() {
  const { user, userRole } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)

  useEffect(() => {
    if (!user || userRole !== "admin") {
      router.push("/dashboard")
      return
    }
    fetchCurrentVideo()
  }, [user, userRole, router])

  const fetchCurrentVideo = async () => {
    setLoading(true)
    try {
      const db = await getFirebaseDb()
      if (!db) {
        toast.error("Database not available")
        return
      }

      const videoDoc = await getDoc(doc(db, "site_settings", "featured_video"))
      if (videoDoc.exists() && videoDoc.data().videoUrl) {
        setCurrentVideoUrl(videoDoc.data().videoUrl)
      }
    } catch (error) {
      console.error("Error fetching video:", error)
      toast.error("Failed to load current video")
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Video file is too large. Maximum size is 100MB")
        return
      }

      // Check file type
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file")
        return
      }

      setVideoFile(file)
    }
  }

  const handleUpload = async () => {
    if (!videoFile || !user) return

    setUploading(true)
    setUploadProgress(0)

    try {
      // Upload to Cloudinary
      const videoUrl = await uploadToCloudinary(videoFile, "video")
      setUploadProgress(80)

      // Save to Firebase
      const db = await getFirebaseDb()
      if (!db) {
        throw new Error("Database not available")
      }

      await setDoc(doc(db, "site_settings", "featured_video"), {
        videoUrl,
        uploadedBy: user.uid,
        uploadedAt: new Date().toISOString(),
        fileName: videoFile.name,
      })

      setUploadProgress(100)
      setCurrentVideoUrl(videoUrl)
      setVideoFile(null)
      toast.success("Featured video updated successfully!")
    } catch (error) {
      console.error("Error uploading video:", error)
      toast.error("Failed to upload video. Please try again.")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove the featured video?")) return

    try {
      const db = await getFirebaseDb()
      if (!db) {
        throw new Error("Database not available")
      }

      await setDoc(doc(db, "site_settings", "featured_video"), {
        videoUrl: null,
        removedBy: user?.uid,
        removedAt: new Date().toISOString(),
      })

      setCurrentVideoUrl(null)
      toast.success("Featured video removed")
    } catch (error) {
      console.error("Error removing video:", error)
      toast.error("Failed to remove video")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Featured Video</h1>
          <p className="text-muted-foreground">Manage the homepage featured video</p>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Current Video */}
        {currentVideoUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Current Featured Video
              </CardTitle>
              <CardDescription>This video is currently displayed on the homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                <video src={currentVideoUrl} controls className="w-full h-full object-cover" />
              </div>
              <Button variant="destructive" onClick={handleRemove}>
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Video
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upload New Video */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              {currentVideoUrl ? "Replace" : "Upload"} Featured Video
            </CardTitle>
            <CardDescription>
              Upload a video to showcase AllotMeal Afroc on the homepage (Max 100MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="video">Select Video File</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                <div className="text-center">
                  <Video className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("video")?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Select Video
                      </>
                    )}
                  </Button>
                  {videoFile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    MP4, MOV, AVI, or WebM (Max 100MB)
                  </p>
                </div>
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!videoFile || uploading}
              className="w-full"
              size="lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Video...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
