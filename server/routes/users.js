const express = require("express")
const { db } = require("../config/firebase")
const { authenticateToken, requireRole } = require("../middleware/auth")

const router = express.Router()

// Get all users (Admin only)
router.get("/", authenticateToken, requireRole(["admin"]), async (req, res) => {
  try {
    const { role, status, limit = 50, offset = 0 } = req.query

    let query = db.collection("users")

    if (role) {
      query = query.where("role", "==", role)
    }

    if (status) {
      query = query.where("isActive", "==", status === "active")
    }

    query = query.orderBy("createdAt", "desc").limit(Number.parseInt(limit)).offset(Number.parseInt(offset))

    const snapshot = await query.get()
    const users = []

    snapshot.forEach((doc) => {
      const userData = doc.data()
      const { password, ...userWithoutPassword } = userData
      users.push({
        id: doc.id,
        ...userWithoutPassword,
      })
    })

    res.json({
      users,
      total: users.length,
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

// Update user role (Admin only)
router.patch("/:userId/role", authenticateToken, requireRole(["admin"]), async (req, res) => {
  try {
    const { userId } = req.params
    const { role } = req.body

    const validRoles = ["user", "content_manager", "admin"]
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" })
    }

    // Prevent admin from demoting themselves
    if (userId === req.user.userId && role !== "admin") {
      return res.status(400).json({ error: "Cannot change your own admin role" })
    }

    await db.collection("users").doc(userId).update({
      role,
      updatedAt: new Date().toISOString(),
    })

    res.json({
      message: "User role updated successfully",
    })
  } catch (error) {
    console.error("Update user role error:", error)
    res.status(500).json({ error: "Failed to update user role" })
  }
})

// Deactivate/Activate user (Admin only)
router.patch("/:userId/status", authenticateToken, requireRole(["admin"]), async (req, res) => {
  try {
    const { userId } = req.params
    const { isActive } = req.body

    // Prevent admin from deactivating themselves
    if (userId === req.user.userId && !isActive) {
      return res.status(400).json({ error: "Cannot deactivate your own account" })
    }

    await db
      .collection("users")
      .doc(userId)
      .update({
        isActive: Boolean(isActive),
        updatedAt: new Date().toISOString(),
      })

    res.json({
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    })
  } catch (error) {
    console.error("Update user status error:", error)
    res.status(500).json({ error: "Failed to update user status" })
  }
})

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.userId).get()

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" })
    }

    const userData = userDoc.data()
    const { password, ...userWithoutPassword } = userData

    res.json({
      user: {
        id: userDoc.id,
        ...userWithoutPassword,
      },
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ error: "Failed to get user profile" })
  }
})

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body

    const updateData = {
      updatedAt: new Date().toISOString(),
    }

    if (firstName) updateData.firstName = firstName
    if (lastName) updateData.lastName = lastName
    if (phone) updateData.phone = phone
    if (avatar) updateData.avatar = avatar

    await db.collection("users").doc(req.user.userId).update(updateData)

    res.json({
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ error: "Failed to update profile" })
  }
})

module.exports = router
