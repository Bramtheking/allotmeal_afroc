export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  format: string
  resource_type: string
  bytes: number
  width?: number
  height?: number
}

export const uploadToCloudinary = async (file: File, resourceType: "image" | "video" = "image"): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "allotmeal_preset")
  formData.append("folder", "allotmeal")

  const endpoint =
    resourceType === "video"
      ? `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`
      : `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload ${resourceType}`)
    }

    const result: CloudinaryUploadResult = await response.json()
    return result.secure_url
  } catch (error) {
    console.error(`Error uploading ${resourceType}:`, error)
    throw error
  }
}

export const getVideoThumbnail = (videoUrl: string): string | null => {
  try {
    // Extract public_id from Cloudinary video URL
    const match = videoUrl.match(/\/v\d+\/(.+)\.(mp4|mov|avi|mkv|webm)$/)
    if (!match) return null

    const publicId = match[1]
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    // Generate thumbnail URL
    return `https://res.cloudinary.com/${cloudName}/video/upload/so_0,w_300,h_200,c_fill/${publicId}.jpg`
  } catch (error) {
    console.error("Error generating video thumbnail:", error)
    return null
  }
}

export const getYouTubeThumbnail = (youtubeUrl: string): string | null => {
  try {
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = youtubeUrl.match(regExp)

    if (match && match[2].length === 11) {
      const videoId = match[2]
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }

    return null
  } catch (error) {
    console.error("Error generating YouTube thumbnail:", error)
    return null
  }
}
