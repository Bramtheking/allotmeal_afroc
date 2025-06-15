const express = require("express")
const multer = require("multer")
const { uploadToCloudinary } = require("../config/cloudinary")
const { authenticateToken, requireRole } = require("../middleware/auth")

const router = express.Router()

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/
    const extname = allowedTypes.test(file.originalname.toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only images and documents are allowed."))
    }
  },
})

// Upload single file
router.post(
  "/single",
  authenticateToken,
  requireRole(["content_manager", "admin"]),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" })
      }

      const { folder = "general" } = req.body

      const result = await uploadToCloudinary(req.file.buffer, {
        folder: `allotmeal-afroc/${folder}`,
        public_id: `${Date.now()}_${req.file.originalname.split(".")[0]}`,
        resource_type: "auto",
      })

      res.json({
        message: "File uploaded successfully",
        file: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          size: result.bytes,
          width: result.width,
          height: result.height,
        },
      })
    } catch (error) {
      console.error("Upload error:", error)
      res.status(500).json({ error: "File upload failed" })
    }
  },
)

// Upload multiple files
router.post(
  "/multiple",
  authenticateToken,
  requireRole(["content_manager", "admin"]),
  upload.array("files", 5), // Max 5 files
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" })
      }

      const { folder = "general" } = req.body
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, {
          folder: `allotmeal-afroc/${folder}`,
          public_id: `${Date.now()}_${file.originalname.split(".")[0]}`,
          resource_type: "auto",
        }),
      )

      const results = await Promise.all(uploadPromises)

      const files = results.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
      }))

      res.json({
        message: "Files uploaded successfully",
        files,
      })
    } catch (error) {
      console.error("Multiple upload error:", error)
      res.status(500).json({ error: "File upload failed" })
    }
  },
)

module.exports = router
