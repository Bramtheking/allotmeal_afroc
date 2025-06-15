const jwt = require("jsonwebtoken")
const { db } = require("../config/firebase")

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database to ensure they still exist and get current role
    const userDoc = await db.collection("users").doc(decoded.userId).get()

    if (!userDoc.exists) {
      return res.status(401).json({ error: "User not found" })
    }

    const userData = userDoc.data()
    req.user = {
      userId: decoded.userId,
      email: userData.email,
      role: userData.role,
      ...userData,
    }

    next()
  } catch (error) {
    console.error("Token verification error:", error)
    return res.status(403).json({ error: "Invalid or expired token" })
  }
}

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" })
    }

    const userRole = req.user.role
    const allowedRoles = Array.isArray(roles) ? roles : [roles]

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: allowedRoles,
        current: userRole,
      })
    }

    next()
  }
}

module.exports = { authenticateToken, requireRole }
