export const uploadToCloudinary = async (file: File, resourceType: "image" | "video" = "image"): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "allotmeal_preset")
  formData.append("folder", "allotmeal")

  const endpoint =
    resourceType === "video"
      ? `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`
      : `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Failed to upload ${resourceType}`)
  }

  const data = await response.json()
  return data.secure_url
}

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" = "image",
): Promise<boolean> => {
  try {
    const response = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId, resourceType }),
    })

    return response.ok
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error)
    return false
  }
}

// Helper function to extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string => {
  const parts = url.split("/")
  const filename = parts[parts.length - 1]
  return filename.split(".")[0]
}

// Helper function to get video thumbnail from Cloudinary
export const getVideoThumbnail = (videoUrl: string): string | null => {
  if (!videoUrl || !videoUrl.includes("cloudinary.com")) {
    return null
  }

  try {
    // Extract the public ID from the video URL
    const urlParts = videoUrl.split("/")
    const uploadIndex = urlParts.findIndex((part) => part === "upload")
    if (uploadIndex === -1) return null

    const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join("/")
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "") // Remove file extension

    // Generate thumbnail URL
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    return `https://res.cloudinary.com/${cloudName}/video/upload/so_0,w_400,h_300,c_fill/${publicId}.jpg`
  } catch (error) {
    console.error("Error generating video thumbnail:", error)
    return null
  }
}

// Helper function to get YouTube thumbnail
export const getYouTubeThumbnail = (youtubeUrl: string): string | null => {
  if (!youtubeUrl) return null

  try {
    let videoId = ""

    if (youtubeUrl.includes("youtube.com/watch?v=")) {
      videoId = youtubeUrl.split("v=")[1]?.split("&")[0]
    } else if (youtubeUrl.includes("youtu.be/")) {
      videoId = youtubeUrl.split("youtu.be/")[1]?.split("?")[0]
    } else if (youtubeUrl.includes("youtube.com/embed/")) {
      videoId = youtubeUrl.split("embed/")[1]?.split("?")[0]
    }

    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
  } catch (error) {
    console.error("Error generating YouTube thumbnail:", error)
  }

  return null
}
