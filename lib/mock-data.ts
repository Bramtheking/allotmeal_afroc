import type { Service } from "./types"
import type { BlogPost, BlogCategory } from "./types/blog"

// Mock data for different service types to use when Firebase is not available
export const getMockJobs = (): Service[] => [
  {
    id: "job-1",
    title: "Senior Software Engineer",
    description:
      "Join our dynamic team as a Senior Software Engineer. Work on cutting-edge projects using modern technologies.",
    serviceType: "jobs",
    company: "Tech Solutions Ltd",
    location: "Nairobi, Kenya",
    contact: "+254 700 123 456",
    email: "careers@techsolutions.co.ke",
    price: "KSh 150,000 - 250,000",
    status: "active",
    createdBy: "hr@techsolutions.co.ke",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    jobType: "permanent",
    salary: "KSh 150,000 - 250,000 per month",
    experience: "3-5 years",
    requirements: [
      "Bachelor's degree in Computer Science",
      "Experience with React/Next.js",
      "Strong problem-solving skills",
    ],
    benefits: ["Health insurance", "Flexible working hours", "Professional development"],
    deadline: "2024-02-15",
  },
  {
    id: "job-2",
    title: "Marketing Coordinator",
    description: "Looking for a creative Marketing Coordinator to develop and execute marketing campaigns.",
    serviceType: "jobs",
    company: "Creative Agency Co",
    location: "Mombasa, Kenya",
    contact: "+254 701 234 567",
    email: "hr@creativeagency.co.ke",
    price: "KSh 80,000 - 120,000",
    status: "active",
    createdBy: "hr@creativeagency.co.ke",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
    jobType: "permanent",
    salary: "KSh 80,000 - 120,000 per month",
    experience: "2-3 years",
    requirements: ["Degree in Marketing or related field", "Experience with digital marketing", "Creative mindset"],
    benefits: ["Health insurance", "Team building events", "Career growth opportunities"],
    deadline: "2024-02-10",
  },
  {
    id: "job-3",
    title: "Freelance Graphic Designer",
    description: "Seeking talented freelance graphic designers for various creative projects.",
    serviceType: "jobs",
    company: "Design Studio Kenya",
    location: "Remote/Nairobi",
    contact: "+254 702 345 678",
    email: "projects@designstudio.co.ke",
    price: "KSh 5,000 - 15,000 per project",
    status: "active",
    createdBy: "projects@designstudio.co.ke",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
    jobType: "casual",
    salary: "KSh 5,000 - 15,000 per project",
    experience: "1-2 years",
    requirements: ["Portfolio of design work", "Proficiency in Adobe Creative Suite", "Strong communication skills"],
    benefits: ["Flexible schedule", "Diverse projects", "Competitive rates"],
    deadline: "2024-02-20",
  },
]

export const getMockEducation = (): Service[] => [
  {
    id: "edu-1",
    title: "Nairobi Technical Institute",
    description: "Leading technical institute offering diploma and certificate courses in engineering and technology.",
    serviceType: "education",
    location: "Nairobi, Kenya",
    contact: "+254 703 456 789",
    email: "info@nairobitch.ac.ke",
    website: "www.nairobitch.ac.ke",
    status: "active",
    createdBy: "admin@nairobitch.ac.ke",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    institutionType: "college",
    collegeType: "technical",
    programs: ["Electrical Engineering", "Mechanical Engineering", "Computer Science"],
    courses: ["Diploma in Engineering", "Certificate in Technology"],
    fees: "KSh 45,000 - 80,000 per year",
  },
  {
    id: "edu-2",
    title: "Greenfield Primary School",
    description: "Quality primary education with focus on academic excellence and character development.",
    serviceType: "education",
    location: "Kisumu, Kenya",
    contact: "+254 704 567 890",
    email: "info@greenfield.ac.ke",
    status: "active",
    createdBy: "admin@greenfield.ac.ke",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    institutionType: "school",
    schoolType: "primary",
    programs: ["CBC Curriculum", "Extra-curricular activities"],
    fees: "KSh 25,000 - 35,000 per term",
  },
  {
    id: "edu-3",
    title: "University of East Africa",
    description: "Premier university offering undergraduate and postgraduate programs across multiple faculties.",
    serviceType: "education",
    location: "Kampala, Uganda",
    contact: "+256 705 678 901",
    email: "admissions@uea.ac.ug",
    website: "www.uea.ac.ug",
    status: "active",
    createdBy: "admin@uea.ac.ug",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    institutionType: "university",
    universityType: "public",
    faculties: ["Engineering", "Business", "Medicine", "Arts"],
    programs: ["Bachelor's degrees", "Master's degrees", "PhD programs"],
    fees: "KSh 120,000 - 300,000 per year",
  },
]

export const getMockHotels = (): Service[] => [
  {
    id: "hotel-1",
    title: "Safari Paradise Resort",
    description: "Luxury resort offering exceptional safari experiences with world-class amenities and service.",
    serviceType: "hotel-industry",
    location: "Maasai Mara, Kenya",
    contact: "+254 706 789 012",
    email: "reservations@safariparadise.co.ke",
    website: "www.safariparadise.co.ke",
    price: "KSh 25,000 - 45,000 per night",
    status: "active",
    createdBy: "admin@safariparadise.co.ke",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    rating: 4.8,
    amenities: ["Swimming Pool", "Spa", "Restaurant", "Game Drives", "WiFi", "Gym"],
    roomTypes: ["Standard Room", "Deluxe Suite", "Presidential Suite"],
  },
  {
    id: "hotel-2",
    title: "City Business Hotel",
    description: "Modern business hotel in the heart of the city with excellent conference facilities.",
    serviceType: "hotel-industry",
    location: "Nairobi CBD, Kenya",
    contact: "+254 707 890 123",
    email: "bookings@citybusiness.co.ke",
    website: "www.citybusiness.co.ke",
    price: "KSh 8,000 - 18,000 per night",
    status: "active",
    createdBy: "admin@citybusiness.co.ke",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    rating: 4.3,
    amenities: ["Business Center", "Conference Rooms", "Restaurant", "WiFi", "Parking", "Airport Shuttle"],
    roomTypes: ["Standard Room", "Executive Room", "Business Suite"],
  },
]

export const getMockAgriculture = (): Service[] => [
  {
    id: "agri-1",
    title: "Premium Dairy Cattle",
    description: "High-quality dairy cattle for commercial and small-scale farming operations.",
    serviceType: "agriculture",
    location: "Nakuru, Kenya",
    contact: "+254 708 901 234",
    email: "sales@premiumdairy.co.ke",
    price: "KSh 80,000 - 150,000 per head",
    status: "active",
    createdBy: "admin@premiumdairy.co.ke",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    category: "animals",
    animalType: "cattle",
  },
  {
    id: "agri-2",
    title: "Organic Vegetables",
    description: "Fresh organic vegetables grown using sustainable farming practices.",
    serviceType: "agriculture",
    location: "Kiambu, Kenya",
    contact: "+254 709 012 345",
    email: "orders@organicvegs.co.ke",
    price: "KSh 150 - 500 per kg",
    status: "active",
    createdBy: "admin@organicvegs.co.ke",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    category: "products",
    productCategory: "vegetables",
  },
]

export const getMockConstruction = (): Service[] => [
  {
    id: "const-1",
    title: "Modern Office Complex",
    description: "State-of-the-art office complex development in prime commercial location.",
    serviceType: "construction",
    location: "Westlands, Nairobi",
    contact: "+254 710 123 456",
    email: "projects@modernbuilders.co.ke",
    price: "KSh 500M - 1B",
    status: "active",
    createdBy: "admin@modernbuilders.co.ke",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    category: "buildings",
    projectType: "commercial",
    projectStatus: "planning",
    completionDate: "2025-12-31",
  },
  {
    id: "const-2",
    title: "Quality Building Materials",
    description: "Comprehensive range of construction materials from trusted suppliers.",
    serviceType: "construction",
    location: "Industrial Area, Nairobi",
    contact: "+254 711 234 567",
    email: "sales@qualitymaterials.co.ke",
    price: "Varies by material",
    status: "active",
    createdBy: "admin@qualitymaterials.co.ke",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    category: "materials",
    materialType: "concrete, steel, timber",
  },
]

export const getMockEntertainment = (): Service[] => [
  {
    id: "ent-1",
    title: "African Cultural Festival",
    description: "Celebrate African heritage with music, dance, food and cultural exhibitions.",
    serviceType: "entertainment",
    location: "Uhuru Gardens, Nairobi",
    contact: "+254 712 345 678",
    email: "info@africanfest.co.ke",
    price: "KSh 1,500 - 5,000",
    status: "active",
    createdBy: "admin@africanfest.co.ke",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    category: "live",
    eventDate: "2024-03-15",
    eventTime: "10:00 AM",
    duration: "8 hours",
  },
  {
    id: "ent-2",
    title: "Comedy Night Live",
    description: "Hilarious comedy show featuring Africa's top comedians and rising stars.",
    serviceType: "entertainment",
    location: "National Theatre, Lagos",
    contact: "+234 803 456 789",
    email: "bookings@comedynight.ng",
    price: "₦ 3,000 - 8,000",
    status: "active",
    createdBy: "admin@comedynight.ng",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
    category: "live",
    eventDate: "2024-02-20",
    eventTime: "8:00 PM",
    duration: "3 hours",
  },
]

export const getMockHealth = (): Service[] => [
  {
    id: "health-1",
    title: "Community Health Screening",
    description: "Free health screening program for diabetes, hypertension and other common conditions.",
    serviceType: "health",
    location: "Kibera Health Center",
    contact: "+254 713 456 789",
    email: "info@communityhealth.org",
    status: "active",
    createdBy: "admin@communityhealth.org",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    healthType: "campaign",
    organizer: "Ministry of Health",
    services: ["Blood pressure check", "Diabetes screening", "BMI assessment"],
    operatingHours: "8:00 AM - 5:00 PM",
  },
  {
    id: "health-2",
    title: "Maternal Health Clinic",
    description: "Comprehensive maternal and child health services including prenatal care and delivery.",
    serviceType: "health",
    location: "Pumwani Maternity Hospital, Nairobi",
    contact: "+254 714 567 890",
    email: "info@pumwanimaternity.go.ke",
    status: "active",
    createdBy: "admin@pumwanimaternity.go.ke",
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03",
    healthType: "clinic",
    organizer: "County Government",
    services: ["Prenatal care", "Delivery services", "Postnatal care", "Family planning"],
    operatingHours: "24/7",
  },
]

export const getMockSMEProducts = (): Service[] => [
  {
    id: "sme-1",
    title: "Handcrafted Furniture",
    description: "Beautiful handcrafted furniture made from quality local materials.",
    serviceType: "sme-products",
    location: "Karen, Nairobi",
    contact: "+254 714 567 890",
    email: "orders@handcrafted.co.ke",
    price: "KSh 15,000 - 80,000",
    status: "active",
    createdBy: "admin@handcrafted.co.ke",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    category: "furniture",
    productType: "custom furniture",
  },
  {
    id: "sme-2",
    title: "Organic Skincare Products",
    description: "Natural skincare products made from African botanicals and traditional recipes.",
    serviceType: "sme-products",
    location: "Cape Town, South Africa",
    contact: "+27 21 456 7890",
    email: "info@organicskin.co.za",
    price: "R 150 - 500",
    status: "active",
    createdBy: "admin@organicskin.co.za",
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
    category: "clothing",
    productType: "skincare",
  },
]

export const getMockTenders = (): Service[] => [
  {
    id: "tender-1",
    title: "Road Construction Project",
    description: "Tender for construction of 50km rural road network in Machakos County.",
    serviceType: "tenders",
    location: "Machakos County",
    contact: "+254 715 678 901",
    email: "tenders@machakos.go.ke",
    price: "KSh 2.5B",
    status: "active",
    createdBy: "admin@machakos.go.ke",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    tenderType: "public",
    budget: "KSh 2.5 Billion",
    agency: "Machakos County Government",
    deadline: "2024-02-28",
  },
]

export const getMockTransport = (): Service[] => [
  {
    id: "transport-1",
    title: "Nairobi-Mombasa Express",
    description: "Comfortable bus service between Nairobi and Mombasa with modern amenities.",
    serviceType: "transport",
    location: "Nairobi - Mombasa",
    contact: "+254 716 789 012",
    email: "bookings@expressbus.co.ke",
    price: "KSh 1,800 - 3,500",
    status: "active",
    createdBy: "admin@expressbus.co.ke",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    transportType: "road",
    route: "Nairobi - Mombasa",
    departureTime: "7:00 AM, 2:00 PM, 9:00 PM",
    features: ["WiFi", "AC", "Refreshments", "Entertainment"],
  },
  {
    id: "transport-2",
    title: "Lagos Airport Shuttle",
    description: "Reliable airport transfer service with professional drivers and comfortable vehicles.",
    serviceType: "transport",
    location: "Lagos, Nigeria",
    contact: "+234 803 789 012",
    email: "bookings@lagosshuttle.ng",
    price: "₦ 5,000 - 12,000",
    status: "active",
    createdBy: "admin@lagosshuttle.ng",
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
    transportType: "road",
    route: "Lagos Airport - City Center",
    departureTime: "Every 30 minutes",
    features: ["24/7 Service", "GPS Tracking", "Professional Drivers", "Clean Vehicles"],
  },
]

// Function to get mock data for any service type
export const getMockDataForServiceType = (serviceType: string): Service[] => {
  switch (serviceType) {
    case "jobs":
      return getMockJobs()
    case "education":
      return getMockEducation()
    case "hotel-industry":
      return getMockHotels()
    case "agriculture":
      return getMockAgriculture()
    case "construction":
      return getMockConstruction()
    case "entertainment":
      return getMockEntertainment()
    case "health":
      return getMockHealth()
    case "sme-products":
      return getMockSMEProducts()
    case "tenders":
      return getMockTenders()
    case "transport":
      return getMockTransport()
    default:
      return []
  }
}

// Mock blog data
export const getMockBlogPosts = (): BlogPost[] => [
  {
    id: "blog-1",
    title: "The Future of African Business: Embracing Digital Transformation",
    slug: "future-of-african-business-digital-transformation",
    content: `<h2>Digital transformation is reshaping African business</h2>
    <p>Africa is experiencing unprecedented growth in digital adoption, with businesses across the continent embracing new technologies to drive innovation and growth. From mobile payments to cloud computing, African entrepreneurs are leading the charge in digital innovation.</p>
    
    <h3>Key Areas of Growth</h3>
    <p>Several sectors are seeing remarkable transformation:</p>
    <ul>
      <li><strong>Fintech:</strong> Mobile money solutions have revolutionized financial services</li>
      <li><strong>Agriculture:</strong> Smart farming technologies are increasing productivity</li>
      <li><strong>Healthcare:</strong> Telemedicine is expanding access to quality care</li>
      <li><strong>Education:</strong> Online learning platforms are democratizing education</li>
    </ul>
    
    <h3>The AllotMeal Approach</h3>
    <p>At AllotMeal Afroc Ltd, we're committed to supporting this digital transformation by connecting businesses with the resources and networks they need to thrive in the digital age.</p>
    
    <p>Our platform serves as a bridge between traditional African business practices and modern digital solutions, ensuring that growth is both sustainable and inclusive.</p>`,
    excerpt: "Discover how digital transformation is reshaping African business and creating new opportunities for growth and innovation across the continent.",
    featuredImage: "/api/placeholder/800/400",
    categories: ["Business", "Technology"],
    tags: ["digital-transformation", "africa", "business-growth", "innovation"],
    author: "Sarah Kimani",
    authorId: "admin-1",
    status: "published",
    publishedAt: new Date("2024-01-20T10:00:00Z"),
    createdAt: new Date("2024-01-18T09:00:00Z"),
    updatedAt: new Date("2024-01-20T10:00:00Z"),
    views: 1250,
    likes: 89
  },
  {
    id: "blog-2", 
    title: "Sustainable Tourism in Kenya: Preserving Heritage While Creating Opportunities",
    slug: "sustainable-tourism-kenya-heritage-opportunities",
    content: `<h2>Kenya's tourism industry is evolving</h2>
    <p>As one of Africa's premier tourist destinations, Kenya is pioneering sustainable tourism practices that preserve our rich cultural heritage while creating meaningful economic opportunities for local communities.</p>
    
    <h3>Community-Based Tourism</h3>
    <p>Local communities are at the heart of Kenya's sustainable tourism initiatives. By involving indigenous communities in tourism planning and operations, we ensure that the benefits of tourism reach those who need them most.</p>
    
    <h3>Wildlife Conservation</h3>
    <p>Sustainable tourism plays a crucial role in wildlife conservation. Tourism revenue directly supports conservation efforts, creating a virtuous cycle where protecting wildlife becomes economically beneficial.</p>
    
    <h3>Cultural Preservation</h3>
    <p>Tourism can be a powerful tool for cultural preservation. By showcasing traditional crafts, music, and customs to visitors, communities have economic incentives to maintain their cultural heritage.</p>`,
    excerpt: "Explore how Kenya is leading the way in sustainable tourism, balancing conservation with economic development and cultural preservation.",
    featuredImage: "/api/placeholder/800/400",
    categories: ["Tourism", "Sustainability"],
    tags: ["kenya", "tourism", "sustainability", "conservation", "culture"],
    author: "James Mwangi",
    authorId: "admin-2",
    status: "published",
    publishedAt: new Date("2024-01-15T08:30:00Z"),
    createdAt: new Date("2024-01-12T14:00:00Z"),
    updatedAt: new Date("2024-01-15T08:30:00Z"),
    views: 892,
    likes: 67
  },
  {
    id: "blog-3",
    title: "Empowering SMEs: How Technology is Leveling the Playing Field",
    slug: "empowering-smes-technology-leveling-playing-field",
    content: `<h2>Small businesses, big opportunities</h2>
    <p>Small and Medium Enterprises (SMEs) form the backbone of African economies, yet they often face significant challenges in accessing markets, finance, and technology. Today's digital revolution is changing that narrative.</p>
    
    <h3>Access to Global Markets</h3>
    <p>E-commerce platforms and digital marketing tools have opened up global markets to even the smallest businesses. African SMEs can now sell their products and services to customers worldwide.</p>
    
    <h3>Digital Payment Solutions</h3>
    <p>Mobile money and digital payment platforms have made it easier for SMEs to accept payments, manage cash flow, and build customer trust through secure transactions.</p>
    
    <h3>Cloud-Based Tools</h3>
    <p>Cloud computing has democratized access to business tools that were once only available to large corporations. From accounting software to customer relationship management systems, SMEs now have access to enterprise-grade solutions at affordable prices.</p>`,
    excerpt: "Learn how technology is empowering small and medium enterprises across Africa, creating new opportunities for growth and success.",
    featuredImage: "/api/placeholder/800/400",
    categories: ["Business", "SME"],
    tags: ["sme", "technology", "entrepreneurship", "digital-tools", "africa"],
    author: "Grace Wanjiku",
    authorId: "admin-3",
    status: "published",
    publishedAt: new Date("2024-01-10T12:00:00Z"),
    createdAt: new Date("2024-01-08T10:30:00Z"),
    updatedAt: new Date("2024-01-10T12:00:00Z"),
    views: 1456,
    likes: 124
  }
]

export const getMockBlogCategories = (): BlogCategory[] => [
  {
    id: "category-1",
    name: "Business",
    slug: "business",
    description: "Insights and strategies for business growth and development",
    color: "#3B82F6",
    postCount: 2,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-20T00:00:00Z")
  },
  {
    id: "category-2",
    name: "Technology",
    slug: "technology", 
    description: "Latest trends and innovations in technology",
    color: "#8B5CF6",
    postCount: 2,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-20T00:00:00Z")
  },
  {
    id: "category-3",
    name: "Tourism",
    slug: "tourism",
    description: "Travel, culture, and tourism industry insights",
    color: "#10B981",
    postCount: 1,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-15T00:00:00Z")
  },
  {
    id: "category-4",
    name: "SME",
    slug: "sme",
    description: "Resources and insights for small and medium enterprises",
    color: "#F59E0B",
    postCount: 1,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-10T00:00:00Z")
  },
  {
    id: "category-5",
    name: "Sustainability",
    slug: "sustainability",
    description: "Environmental and social responsibility in business",
    color: "#059669",
    postCount: 1,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-15T00:00:00Z")
  }
]
