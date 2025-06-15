const { db } = require("../config/firebase")

// Sample data for seeding the database
const sampleServices = {
  "hotel-industry": [
    {
      title: "Serena Hotel Nairobi",
      description: "Luxury 5-star hotel in the heart of Nairobi with world-class amenities.",
      category: "hotel-industry",
      subcategory: "accommodation",
      location: "Nairobi CBD, Kenya",
      price: "From KSh 15,000 per night",
      contact: {
        phone: "+254-20-2822000",
        email: "reservations@serena.co.ke",
        whatsapp: "+254722000000",
      },
      features: ["5-star luxury", "Conference facilities", "Spa & wellness", "Fine dining"],
      images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      searchTerms: ["serena", "hotel", "luxury", "nairobi", "accommodation"],
    },
  ],
  jobs: [
    {
      title: "Software Developer - React/Node.js",
      description: "We are looking for an experienced full-stack developer to join our growing team.",
      category: "jobs",
      subcategory: "permanent",
      location: "Nairobi, Kenya",
      price: "KSh 120,000 - 180,000 per month",
      contact: {
        email: "careers@techcompany.co.ke",
        phone: "+254700000000",
      },
      features: ["Remote work options", "Health insurance", "Professional development", "Flexible hours"],
      requirements: [
        "3+ years React experience",
        "Node.js and Express knowledge",
        "Database experience (MongoDB/PostgreSQL)",
        "Git version control",
      ],
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      searchTerms: ["software", "developer", "react", "nodejs", "programming", "nairobi"],
    },
  ],
  agriculture: [
    {
      title: "Organic Tomatoes - Fresh from Farm",
      description: "High-quality organic tomatoes grown without pesticides. Perfect for restaurants and households.",
      category: "agriculture",
      subcategory: "produce",
      location: "Nakuru County, Kenya",
      price: "KSh 80 per kg",
      contact: {
        phone: "+254722000001",
        whatsapp: "+254722000001",
      },
      features: ["Organic certified", "Fresh daily harvest", "Bulk discounts available", "Direct from farm"],
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      searchTerms: ["organic", "tomatoes", "fresh", "farm", "vegetables", "nakuru"],
    },
  ],
}

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...")

    for (const [category, services] of Object.entries(sampleServices)) {
      console.log(`📝 Seeding ${category} services...`)

      for (const service of services) {
        await db.collection("services").add(service)
      }

      console.log(`✅ ${category}: ${services.length} services added`)
    }

    console.log("🎉 Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Seeding failed:", error)
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
}

module.exports = { seedDatabase }
