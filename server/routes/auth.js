const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")
const { db } = require("../config/firebase")
const { validateRequest, schemas } = require("../middleware/validation")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Generate JWT token
const generateToken = (userId, email, role) => {
  return jwt.sign({ userId, email, role }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// Register
router.post("/register", validateRequest(schemas.register), async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body

    // Check if user already exists
    const existingUser = await db.collection("users").where("email", "==", email).get()
    if (!existingUser.empty) {
      return res.status(400).json({ error: "User already exists with this email" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user document
    const userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || "",
      role: "user", // Default role
      provider: "email",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    }

    const userRef = await db.collection("users").add(userData)
    const token = generateToken(userRef.id, email, "user")

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: userRef.id,
        email,
        firstName,
        lastName,
        role: "user",
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Registration failed" })
  }
})

// Login
router.post("/login", validateRequest(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const userQuery = await db.collection("users").where("email", "==", email).get()
    if (userQuery.empty) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const userDoc = userQuery.docs[0]
    const userData = userDoc.data()

    // Check if account is active
    if (!userData.isActive) {
      return res.status(401).json({ error: "Account is deactivated" })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = generateToken(userDoc.id, userData.email, userData.role)

    res.json({
      message: "Login successful",
      token,
      user: {
        id: userDoc.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
})

// Google OAuth login
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { email, given_name, family_name, picture } = payload

    // Check if user exists
    const userQuery = await db.collection("users").where("email", "==", email).get()
    let userId, userData

    if (userQuery.empty) {
      // Create new user
      const newUserData = {
        email,
        firstName: given_name,
        lastName: family_name,
        avatar: picture,
        role: "user",
        provider: "google",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      }

      const userRef = await db.collection("users").add(newUserData)
      userId = userRef.id
      userData = newUserData
    } else {
      // Existing user
      const userDoc = userQuery.docs[0]
      userId = userDoc.id
      userData = userDoc.data()

      // Check if account is active
      if (!userData.isActive) {
        return res.status(401).json({ error: "Account is deactivated" })
      }

      // Update avatar if changed
      if (userData.avatar !== picture) {
        await db.collection("users").doc(userId).update({
          avatar: picture,
          updatedAt: new Date().toISOString(),
        })
      }
    }

    const token = generateToken(userId, userData.email, userData.role)

    res.json({
      message: "Google login successful",
      token,
      user: {
        id: userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        avatar: userData.avatar,
      },
    })
  } catch (error) {
    console.error("Google login error:", error)
    res.status(500).json({ error: "Google login failed" })
  }
})

// Get current user
router.get("/me", authenticateToken, async (req, res) => {
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
    console.error("Get user error:", error)
    res.status(500).json({ error: "Failed to get user data" })
  }
})

// Refresh token
router.post("/refresh", authenticateToken, async (req, res) => {
  try {
    const token = generateToken(req.user.userId, req.user.email, req.user.role)
    res.json({ token })
  } catch (error) {
    console.error("Token refresh error:", error)
    res.status(500).json({ error: "Token refresh failed" })
  }
})

module.exports = router
