export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: "user" | "marketing" | "admin"
  status: "active" | "suspended"
  createdAt: string
  updatedAt: string
  selectedRole?: string // Add this for role selection persistence
}

export interface Service {
  id?: string
  slug?: string // SEO-friendly URL slug
  title: string
  description: string
  serviceType: string
  images?: string[]
  videos?: string[] // Add video support
  youtubeLinks?: string[] // Add YouTube link support
  location?: string
  town?: string // Kenyan town
  contact?: string
  email?: string
  website?: string
  price?: string
  company?: string
  status: "active" | "suspended" | "pending"
  createdBy: string
  createdAt: string
  updatedAt: string
  views?: number

  // Hotel specific fields
  rating?: number
  amenities?: string[]
  roomTypes?: string[]

  // SME Products specific fields
  productType?: string
  quantity?: string
  specifications?: string[]
  category?: string

  // Entertainment specific fields
  eventDate?: string
  eventTime?: string
  duration?: string
  subscriptionType?: string

  // Jobs specific fields
  jobType?: "casual" | "permanent" | "full-time" | "part-time" | "contract"
  salary?: string
  experience?: string
  requirements?: string[]
  benefits?: string[]
  deadline?: string

  // Agriculture specific fields
  animalType?: string
  productCategory?: string
  structureSize?: string

  // Tenders specific fields
  tenderType?: "private" | "public"
  budget?: string
  agency?: string

  // Education specific fields
  institutionType?: "school" | "college" | "university"
  schoolType?: string
  collegeType?: string
  universityType?: string
  programs?: string[]
  courses?: string[]
  faculties?: string[]
  fees?: string

  // Health specific fields
  healthType?: "campaign" | "clinic" | "program"
  organizer?: string
  services?: string[]
  operatingHours?: string
  benefits?: string[]

  // Transport specific fields
  transportType?: "road" | "air" | "ocean"
  route?: string
  departureTime?: string
  airline?: string
  capacity?: string
  features?: string[]

  // Construction specific fields
  projectType?: string
  projectStatus?: string
  completionDate?: string
  materialType?: string
  serviceCategory?: string
  specializations?: string[]

  // Sermon specific fields
  sermonType?: "live" | "recorded" | "upcoming"
  preacher?: string
  sermonDate?: string
  sermonTime?: string
  topic?: string
  scripture?: string
  language?: string
  denomination?: string
}

export interface Advertisement {
  id?: string
  title: string
  description: string
  company?: string // Optional for backward compatibility
  adType: "banner" | "featured" | "sponsored" | "popup"
  placement?: string
  priority?: string
  images?: string[]
  videos?: string[] // Add video support
  youtubeLinks?: string[] // Add YouTube link support
  targetAudience?: string[]
  budget?: {
    amount: number
    currency: string
  }
  startDate: string
  endDate?: string // Optional for backward compatibility with old ads
  website?: string
  contact?: string
  price?: string
  location?: string
  status: "active" | "suspended" | "pending" | "expired"
  createdBy: string
  createdAt: string
  updatedAt: string
  clicks?: number
  impressions?: number
  // Self-service advertisement fields
  isSelfService?: boolean
  duration?: string // "1day", "1week", "1month", "6months", "1year"
  paymentAmount?: number
  paymentStatus?: "pending" | "completed" | "failed"
  transactionId?: string
  mpesaReceiptNumber?: string
  autoExpires?: boolean
}

export interface Partner {
  id: string
  name: string
  role: string
  image: string
  website?: string
  description?: string
}

export interface Job {
  id?: string
  title: string
  company: string
  description: string
  requirements: string[]
  location: string
  jobType: "full-time" | "part-time" | "contract" | "casual"
  salary?: {
    min?: number
    max?: number
    currency: string
    period: "hourly" | "daily" | "monthly" | "yearly"
  }
  applicationDeadline?: string
  contactInfo: {
    email: string
    phone?: string
  }
  status: "active" | "closed" | "suspended"
  createdBy: string
  createdAt: string
  updatedAt: string
  applications?: number
}

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  format: string
  resource_type: string
  bytes: number
  width?: number
  height?: number
}
