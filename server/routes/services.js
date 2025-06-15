const express = require("express")
const { db } = require("../config/firebase")
const { authenticateToken, requireRole } = require("../middleware/auth")
const { validateRequest, schemas } = require("../middleware/validation")

const router = express.Router()

// Service categories
const CATEGORIES = {
  "hotel-industry": "Hotel & Industry",
  "sme-products": "SME Products",
  entertainment: "Entertainment & Gigs",
  jobs: "Jobs",
  agriculture: "Agriculture",
  tenders: "Tenders",
  education: "Education",
  health: "Health Sector",
  transport: "Transport Infrastructure",
  construction: "Construction & Repairs",
}

// Format response based on client type
const formatResponse = (data, format = "web") => {
  if (format === "ussd") {
    // Simple text format for USSD
    if (Array.isArray(data)) {
      return data
        .map(
          (item, index) => `${index + 1}. ${item.title}\n${item.price || "Contact for price"}\n${item.location || ""}`,
        )
        .join("\n---\n")
    }
    return `${data.title}\n${data.description}\n${data.price || "Contact for price"}`
  }

  if (format === "whatsapp") {
    // WhatsApp format with emojis and formatting
    if (Array.isArray(data)) {
      return data
        .map(
          (item, index) =>
            `*${index + 1}. ${item.title}*\n📍 ${item.location || "Location not specified"}\n💰 ${item.price || "Contact for price"}\n📞 ${item.contact?.phone || "Contact via platform"}`,
        )
        .join("\n\n---\n\n")
    }
    return `*${data.title}*\n\n${data.description}\n\n📍 *Location:* ${data.location || "Not specified"}\n💰 *Price:* ${data.price || "Contact for price"}`
  }

  // Default web/mobile format
  return data
}

// Get all services by category
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params
    const {
      format = "web",
      search,
      limit = 20,
      offset = 0,
      status = "active",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query

    if (!CATEGORIES[category]) {
      return res.status(400).json({ error: "Invalid category" })
    }

    let query = db.collection("services").where("category", "==", category).where("status", "==", status)

    // Add search functionality
    if (search) {
      // Note: Firestore doesn't support full-text search natively
      // For production, consider using Algolia or Elasticsearch
      query = query.where(
        "searchTerms",
        "array-contains-any",
        search
          .toLowerCase()
          .split(" ")
          .filter((term) => term.length > 2),
      )
    }

    // Apply sorting
    query = query.orderBy(sortBy, sortOrder)

    // Apply pagination
    query = query.limit(Number.parseInt(limit)).offset(Number.parseInt(offset))

    const snapshot = await query.get()
    const services = []

    snapshot.forEach((doc) => {
      services.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    const formattedData = formatResponse(services, format)

    res.json({
      category: CATEGORIES[category],
      services: formattedData,
      total: services.length,
      hasMore: services.length === Number.parseInt(limit),
    })
  } catch (error) {
    console.error("Get services error:", error)
    res.status(500).json({ error: "Failed to fetch services" })
  }
})

// Get single service
router.get("/:category/:id", async (req, res) => {
  try {
    const { category, id } = req.params
    const { format = "web" } = req.query

    if (!CATEGORIES[category]) {
      return res.status(400).json({ error: "Invalid category" })
    }

    const doc = await db.collection("services").doc(id).get()

    if (!doc.exists) {
      return res.status(404).json({ error: "Service not found" })
    }

    const serviceData = doc.data()

    // Check if service belongs to the requested category
    if (serviceData.category !== category) {
      return res.status(404).json({ error: "Service not found in this category" })
    }

    const service = {
      id: doc.id,
      ...serviceData,
    }

    const formattedData = formatResponse(service, format)

    res.json({
      service: formattedData,
    })
  } catch (error) {
    console.error("Get service error:", error)
    res.status(500).json({ error: "Failed to fetch service" })
  }
})

// Create new service (Content Manager or Admin only)
router.post(
  "/:category",
  authenticateToken,
  requireRole(["content_manager", "admin"]),
  validateRequest(schemas.service),
  async (req, res) => {
    try {
      const { category } = req.params

      if (!CATEGORIES[category]) {
        return res.status(400).json({ error: "Invalid category" })
      }

      const serviceData = {
        ...req.body,
        category,
        createdBy: req.user.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Create search terms for basic search functionality
        searchTerms: [
          ...req.body.title.toLowerCase().split(" "),
          ...req.body.description.toLowerCase().split(" "),
          ...(req.body.location ? req.body.location.toLowerCase().split(" ") : []),
        ].filter((term) => term.length > 2),
      }

      const docRef = await db.collection("services").add(serviceData)

      res.status(201).json({
        message: "Service created successfully",
        service: {
          id: docRef.id,
          ...serviceData,
        },
      })
    } catch (error) {
      console.error("Create service error:", error)
      res.status(500).json({ error: "Failed to create service" })
    }
  },
)

// Update service (Content Manager or Admin only)
router.put(
  "/:category/:id",
  authenticateToken,
  requireRole(["content_manager", "admin"]),
  validateRequest(schemas.service),
  async (req, res) => {
    try {
      const { category, id } = req.params

      if (!CATEGORIES[category]) {
        return res.status(400).json({ error: "Invalid category" })
      }

      const doc = await db.collection("services").doc(id).get()

      if (!doc.exists) {
        return res.status(404).json({ error: "Service not found" })
      }

      const existingData = doc.data()

      // Check if user can edit this service
      if (req.user.role !== "admin" && existingData.createdBy !== req.user.userId) {
        return res.status(403).json({ error: "You can only edit your own services" })
      }

      const updateData = {
        ...req.body,
        category,
        updatedAt: new Date().toISOString(),
        // Update search terms
        searchTerms: [
          ...req.body.title.toLowerCase().split(" "),
          ...req.body.description.toLowerCase().split(" "),
          ...(req.body.location ? req.body.location.toLowerCase().split(" ") : []),
        ].filter((term) => term.length > 2),
      }

      await db.collection("services").doc(id).update(updateData)

      res.json({
        message: "Service updated successfully",
        service: {
          id,
          ...existingData,
          ...updateData,
        },
      })
    } catch (error) {
      console.error("Update service error:", error)
      res.status(500).json({ error: "Failed to update service" })
    }
  },
)

// Delete service (Admin only)
router.delete("/:category/:id", authenticateToken, requireRole(["admin"]), async (req, res) => {
  try {
    const { category, id } = req.params

    if (!CATEGORIES[category]) {
      return res.status(400).json({ error: "Invalid category" })
    }

    const doc = await db.collection("services").doc(id).get()

    if (!doc.exists) {
      return res.status(404).json({ error: "Service not found" })
    }

    await db.collection("services").doc(id).delete()

    res.json({
      message: "Service deleted successfully",
    })
  } catch (error) {
    console.error("Delete service error:", error)
    res.status(500).json({ error: "Failed to delete service" })
  }
})

// Get all categories
router.get("/", async (req, res) => {
  try {
    const { format = "web" } = req.query

    if (format === "ussd") {
      const ussdMenu = Object.entries(CATEGORIES)
        .map(([key, value], index) => `${index + 1}. ${value}`)
        .join("\n")

      return res.json({
        menu: ussdMenu,
        categories: Object.keys(CATEGORIES),
      })
    }

    res.json({
      categories: CATEGORIES,
    })
  } catch (error) {
    console.error("Get categories error:", error)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
})

module.exports = router
