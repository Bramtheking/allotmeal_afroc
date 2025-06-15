const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")
const { db } = require("../config/firebase")
const { validateRequest, schemas } = require("../middleware/validation")

const router = express.Router()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Generate JWT token
const generateToken = (userId, email, role) => {
  return jwt.sign({ userId, email, role }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// Register user
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

    // Create user
    const userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || "",
      role: "user", // Default role
      provider: "email",
      avatar: "",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const docRef = await db.collection("users").add(userData)

    // Generate token
    const token = generateToken(docRef.id, email, "user")

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: docRef.id,
        email,
        firstName,
        lastName,
        role: "user",
        avatar: "",
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Registration failed" })
  }
})

// Login user
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

    // Check if user is active
    if (!userData.isActive) {
      return res.status(401).json({ error: "Account is deactivated" })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate token
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
        avatar: userData.avatar,
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
    const { token } = req.body

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { email, given_name, family_name, picture } = payload

    // Check if user exists
    const existingUser = await db.collection("users").where("email", "==", email).get()

    let userId, userData

    if (existingUser.empty) {
      // Create new user
      userData = {
        email,
        firstName: given_name || "",
        lastName: family_name || "",
        phone: "",
        role: "user",
        provider: "google",
        avatar: picture || "",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const docRef = await db.collection("users").add(userData)
      userId = docRef.id
    } else {
      // Update existing user
      const userDoc = existingUser.docs[0]
      userId = userDoc.id
      userData = userDoc.data()

      // Update avatar if changed
      if (picture && picture !== userData.avatar) {
        await db.collection("users").doc(userId).update({
          avatar: picture,
          updatedAt: new Date().toISOString(),
        })
        userData.avatar = picture
      }
    }

    // Generate JWT token
    const jwtToken = generateToken(userId, email, userData.role)

    res.json({
      message: "Google login successful",
      token: jwtToken,
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
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ error: "No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userDoc = await db.collection("users").doc(decoded.userId).get()

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" })
    }

    const userData = userDoc.data()

    res.json({
      user: {
        id: userDoc.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        avatar: userData.avatar,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(401).json({ error: "Invalid token" })
  }
})

module.exports = router
