export const uploadToCloudinary = async (file: File, resourceType: "image" | "video" = "image"): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "allotmeal_preset") // Corrected field name and value
  formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "")

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    throw new Error("Cloudinary cloud name not configured")
  }

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Cloudinary upload error:", errorData)
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    throw error
  }
}

export const getVideoThumbnail = (videoUrl: string): string | null => {
  if (!videoUrl) return null

  try {
    // Extract public ID from Cloudinary URL
    const urlParts = videoUrl.split("/")
    const publicIdWithExtension = urlParts[urlParts.length - 1]
    const publicId = publicIdWithExtension.split(".")[0]

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    if (!cloudName) return null

    // Generate thumbnail URL
    return `https://res.cloudinary.com/${cloudName}/video/upload/so_0,w_300,h_200,c_fill/${publicId}.jpg`
  } catch (error) {
    console.error("Error generating video thumbnail:", error)
    return null
  }
}

export const getYouTubeThumbnail = (youtubeUrl: string): string | null => {
  if (!youtubeUrl) return null

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
