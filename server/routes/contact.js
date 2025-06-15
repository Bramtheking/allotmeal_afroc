const express = require("express")
const nodemailer = require("nodemailer")
const { db } = require("../config/firebase")
const { validateRequest, schemas } = require("../middleware/validation")

const router = express.Router()

// Configure nodemailer (backup email service)
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Submit contact form
router.post("/", validateRequest(schemas.contact), async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Save to database
    const contactData = {
      name,
      email,
      subject,
      message,
      status: "new",
      createdAt: new Date().toISOString(),
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    }

    const docRef = await db.collection("contacts").add(contactData)

    // Send email notification (optional backup)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL || "info@allotmealafroc.com",
          subject: `New Contact Form: ${subject}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          `,
        })
      } catch (emailError) {
        console.error("Email notification failed:", emailError)
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      message: "Contact form submitted successfully",
      id: docRef.id,
    })
  } catch (error) {
    console.error("Contact form error:", error)
    res.status(500).json({ error: "Failed to submit contact form" })
  }
})

// Get contact submissions (Admin only)
router.get("/", async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query

    let query = db.collection("contacts")

    if (status) {
      query = query.where("status", "==", status)
    }

    query = query.orderBy("createdAt", "desc").limit(Number.parseInt(limit)).offset(Number.parseInt(offset))

    const snapshot = await query.get()
    const contacts = []

    snapshot.forEach((doc) => {
      contacts.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    res.json({
      contacts,
      total: contacts.length,
    })
  } catch (error) {
    console.error("Get contacts error:", error)
    res.status(500).json({ error: "Failed to fetch contacts" })
  }
})

module.exports = router
