const express = require("express")
const nodemailer = require("nodemailer")
const { db } = require("../config/firebase")
const { validateRequest, schemas } = require("../middleware/validation")

const router = express.Router()

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

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
      ipAddress: req.ip || "unknown",
      userAgent: req.get("User-Agent") || "unknown",
      createdAt: new Date().toISOString(),
    }

    const docRef = await db.collection("contacts").add(contactData)

    // Send email notification (optional)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = createTransporter()

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
          subject: `New Contact Form Submission: ${subject}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
            <hr>
            <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
          `,
        }

        await transporter.sendMail(mailOptions)
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
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

module.exports = router
