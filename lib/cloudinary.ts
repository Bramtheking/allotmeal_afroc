import type { CloudinaryUploadResult } from "./types"

export const uploadToCloudinary = async (
  file: File,
  resourceType: "image" | "video" = "image",
): Promise<CloudinaryUploadResult> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "allotmeal_preset") // You need to create this in Cloudinary
  formData.append("folder", "allotmeal")

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to upload ${resourceType}`)
  }

  return response.json()
}

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  const response = await fetch("/api/cloudinary/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId }),
  })

  if (!response.ok) {
    throw new Error("Failed to delete image")
  }
}

export const getVideoThumbnail = (videoUrl: string) => {
  // Extract public_id from Cloudinary video URL
  const publicIdMatch = videoUrl.match(/\/v\d+\/(.+)\.[^.]+$/)
  if (publicIdMatch) {
    const publicId = publicIdMatch[1]
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    return `https://res.cloudinary.com/${cloudName}/video/upload/so_0/${publicId}.jpg`
  }
  return null
}

export const getYouTubeThumbnail = (url: string) => {
  const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return videoId ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg` : null
}
