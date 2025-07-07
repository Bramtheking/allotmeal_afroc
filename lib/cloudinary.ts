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
