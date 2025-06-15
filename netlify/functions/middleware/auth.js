const jwt = require("jsonwebtoken")
const { db } = require("../config/firebase")

// Authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database to ensure they still exist and are active
    const userDoc = await db.collection("users").doc(decoded.userId).get()

    if (!userDoc.exists) {
      return res.status(401).json({ error: "User not found" })
    }

    const userData = userDoc.data()

    if (!userData.isActive) {
      return res.status(401).json({ error: "Account is deactivated" })
    }

    req.user = {
      userId: userDoc.id,
      email: userData.email,
      role: userData.role,
      ...decoded,
    }

    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.status(403).json({ error: "Invalid or expired token" })
  }
}

// Require specific role(s)
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" })
    }

    next()
  }
}

module.exports = {
  authenticateToken,
  requireRole,
}
