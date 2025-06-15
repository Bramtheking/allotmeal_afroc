const express = require("express")
const serverless = require("serverless-http")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const servicesRoutes = require("./routes/services")
const uploadRoutes = require("./routes/upload")
const contactRoutes = require("./routes/contact")
const adminRoutes = require("./routes/admin")

const app = express()

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use(limiter)

// CORS configuration
app.use(
  cors({
    origin: true, // Allow all origins for Netlify
    credentials: true,
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Routes
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/services", servicesRoutes)
app.use("/upload", uploadRoutes)
app.use("/contact", contactRoutes)
app.use("/admin", adminRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Allotmeal Afroc API is running on Netlify Functions",
    timestamp: new Date().toISOString(),
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Export the serverless function
module.exports.handler = serverless(app)
