const express = require("express")
const { db } = require("../config/firebase")
const { authenticateToken, requireRole } = require("../middleware/auth")

const router = express.Router()

// Get dashboard statistics (Admin only)
router.get("/dashboard", authenticateToken, requireRole(["admin"]), async (req, res) => {
  try {
    // Get counts for different collections
    const [usersSnapshot, servicesSnapshot, contactsSnapshot] = await Promise.all([
      db.collection("users").get(),
      db.collection("services").get(),
      db.collection("contacts").get(),
    ])

    // Count by user roles
    const userRoles = { user: 0, content_manager: 0, admin: 0 }
    usersSnapshot.forEach((doc) => {
      const role = doc.data().role
      if (userRoles.hasOwnProperty(role)) {
        userRoles[role]++
      }
    })

    // Count by service categories
    const serviceCategories = {}
    servicesSnapshot.forEach((doc) => {
      const category = doc.data().category
      serviceCategories[category] = (serviceCategories[category] || 0) + 1
    })

    // Count by service status
    const serviceStatus = { active: 0, inactive: 0, pending: 0 }
    servicesSnapshot.forEach((doc) => {
      const status = doc.data().status || "active"
      if (serviceStatus.hasOwnProperty(status)) {
        serviceStatus[status]++
      }
    })

    // Count contact form status
    const contactStatus = { new: 0, read: 0, replied: 0 }
    contactsSnapshot.forEach((doc) => {
      const status = doc.data().status || "new"
      if (contactStatus.hasOwnProperty(status)) {
        contactStatus[status]++
      }
    })

    res.json({
      overview: {
        totalUsers: usersSnapshot.size,
        totalServices: servicesSnapshot.size,
        totalContacts: contactsSnapshot.size,
        activeServices: serviceStatus.active,
      },
      userRoles,
      serviceCategories,
      serviceStatus,
      contactStatus,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    res.status(500).json({ error: "Failed to fetch dashboard data" })
  }
})

// Get recent activities (Admin only)
router.get("/activities", authenticateToken, requireRole(["admin"]), async (req, res) => {
  try {
    const { limit = 20 } = req.query

    // Get recent services
    const recentServices = await db
      .collection("services")
      .orderBy("createdAt", "desc")
      .limit(Number.parseInt(limit) / 2)
      .get()

    // Get recent contacts
    const recentContacts = await db
      .collection("contacts")
      .orderBy("createdAt", "desc")
      .limit(Number.parseInt(limit) / 2)
      .get()

    const activities = []

    recentServices.forEach((doc) => {
      const data = doc.data()
      activities.push({
        id: doc.id,
        type: "service_created",
        title: `New ${data.category} service: ${data.title}`,
        timestamp: data.createdAt,
        user: data.createdBy,
      })
    })

    recentContacts.forEach((doc) => {
      const data = doc.data()
      activities.push({
        id: doc.id,
        type: "contact_received",
        title: `New contact: ${data.subject}`,
        timestamp: data.createdAt,
        user: data.email,
      })
    })

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    res.json({
      activities: activities.slice(0, Number.parseInt(limit)),
    })
  } catch (error) {
    console.error("Activities error:", error)
    res.status(500).json({ error: "Failed to fetch activities" })
  }
})

// Bulk operations for services (Admin only)
router.post("/services/bulk", authenticateToken, requireRole(["admin"]), async (req, res) => {
  try {
    const { action, serviceIds } = req.body

    if (!action || !serviceIds || !Array.isArray(serviceIds)) {
      return res.status(400).json({ error: "Invalid request data" })
    }

    const batch = db.batch()

    switch (action) {
      case "activate":
        serviceIds.forEach((id) => {
          const ref = db.collection("services").doc(id)
          batch.update(ref, {
            status: "active",
            updatedAt: new Date().toISOString(),
          })
        })
        break

      case "deactivate":
        serviceIds.forEach((id) => {
          const ref = db.collection("services").doc(id)
          batch.update(ref, {
            status: "inactive",
            updatedAt: new Date().toISOString(),
          })
        })
        break

      case "delete":
        serviceIds.forEach((id) => {
          const ref = db.collection("services").doc(id)
          batch.delete(ref)
        })
        break

      default:
        return res.status(400).json({ error: "Invalid action" })
    }

    await batch.commit()

    res.json({
      message: `Bulk ${action} completed successfully`,
      affectedCount: serviceIds.length,
    })
  } catch (error) {
    console.error("Bulk operation error:", error)
    res.status(500).json({ error: "Bulk operation failed" })
  }
})

module.exports = router
