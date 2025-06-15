# Allotmeal Afroc Ltd - Complete Setup Guide

This guide will walk you through setting up the complete Allotmeal Afroc platform with backend API and frontend application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git
- A code editor (VS Code recommended)

## 🔧 Backend Setup

### 1. Navigate to Server Directory

\`\`\`bash
cd server
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Environment Configuration

Create a `.env` file in the server directory:

\`\`\`bash
cp .env.example .env
\`\`\`

Fill in your environment variables:

\`\`\`env
# Server Configuration
NODE_ENV=development
PORT=5000

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=your_client_cert_url

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration (Optional)
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@allotmealafroc.com
\`\`\`

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate new private key and download JSON file
6. Extract the values for your `.env` file

### 5. Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add them to your `.env` file

### 6. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:3000`, `http://localhost:5000`
6. Copy Client ID and Secret to `.env`

### 7. Start the Backend Server

\`\`\`bash
npm run dev
\`\`\`

The server will start on `http://localhost:5000`

### 8. Seed Sample Data (Optional)

\`\`\`bash
node scripts/seed-data.js
\`\`\`

## 🎨 Frontend Setup

### 1. Navigate to Root Directory

\`\`\`bash
cd ..  # Go back to root if you're in server directory
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Fill in your environment variables:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Google OAuth (for frontend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Firebase Configuration (for frontend if needed)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com

# Cloudinary (for frontend uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# App Configuration
NEXT_PUBLIC_APP_NAME="Allotmeal Afroc Ltd"
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. Start the Frontend

\`\`\`bash
npm run dev
\`\`\`

The frontend will start on `http://localhost:3000`

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. **Railway Deployment:**
   \`\`\`bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   \`\`\`

2. **Environment Variables:**
   - Set all environment variables in your deployment platform
   - Update `CORS` origins to include your production domain
   - Set `NODE_ENV=production`

### Frontend Deployment (Vercel/Netlify)

1. **Vercel Deployment:**
   \`\`\`bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel
   \`\`\`

2. **Environment Variables:**
   - Set all `NEXT_PUBLIC_*` variables in Vercel dashboard
   - Update `NEXT_PUBLIC_API_URL` to your backend URL

## 📊 Database Schema

The application uses Firebase Firestore with the following collections:

### Users Collection
\`\`\`javascript
{
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "user", // user | content_manager | admin
  provider: "email", // email | google
  avatar: "https://...",
  phone: "+254...",
  isActive: true,
  createdAt: "2023-...",
  updatedAt: "2023-..."
}
\`\`\`

### Services Collection
\`\`\`javascript
{
  title: "Service Title",
  description: "Service description",
  category: "jobs", // hotel-industry | sme-products | entertainment | jobs | agriculture | tenders | education | health | transport | construction
  subcategory: "permanent",
  location: "Nairobi, Kenya",
  price: "KSh 100,000",
  contact: {
    phone: "+254...",
    email: "contact@...",
    whatsapp: "+254..."
  },
  features: ["Feature 1", "Feature 2"],
  images: ["https://..."],
  status: "active", // active | inactive | pending
  createdBy: "user_id",
  searchTerms: ["keyword1", "keyword2"],
  createdAt: "2023-...",
  updatedAt: "2023-..."
}
\`\`\`

### Contacts Collection
\`\`\`javascript
{
  name: "John Doe",
  email: "john@example.com",
  subject: "Inquiry",
  message: "Message content",
  status: "new", // new | read | replied
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  createdAt: "2023-..."
}
\`\`\`

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Services
- `GET /api/services/:category` - Get services by category
- `GET /api/services/:category/:id` - Get single service
- `POST /api/services/:category` - Create service (Auth required)
- `PUT /api/services/:category/:id` - Update service (Auth required)
- `DELETE /api/services/:category/:id` - Delete service (Admin only)

### Upload
- `POST /api/upload/single` - Upload single file (Auth required)
- `POST /api/upload/multiple` - Upload multiple files (Auth required)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact submissions (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `PATCH /api/users/:id/role` - Update user role (Admin only)
- `PATCH /api/users/:id/status` - Update user status (Admin only)
- `GET /api/users/profile` - Get user profile (Auth required)
- `PUT /api/users/profile` - Update user profile (Auth required)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats (Admin only)
- `GET /api/admin/activities` - Get recent activities (Admin only)
- `POST /api/admin/services/bulk` - Bulk operations (Admin only)

## 🎯 Features Implemented

### ✅ Backend Features
- [x] Node.js/Express server setup
- [x] Firebase Firestore integration
- [x] Cloudinary image upload
- [x] JWT authentication
- [x] Google OAuth integration
- [x] User management (3 roles: user, content_manager, admin)
- [x] Services CRUD (jobs, hotels, construction, etc.)
- [x] Contact form handling
- [x] Search functionality per category
- [x] Role-based access control
- [x] API endpoints for all platforms (web/future USSD/WhatsApp/Android)
- [x] Rate limiting and security middleware
- [x] Input validation
- [x] Error handling

### ✅ Frontend Features
- [x] Enhanced yellow/blue theme colors
- [x] Additional animations with framer-motion
- [x] Social media links (Facebook, Twitter, Instagram, LinkedIn, YouTube)
- [x] Working contact form with backend integration
- [x] Authentication UI (login/signup/Google)
- [x] Role-based navigation
- [x] Admin dashboard
- [x] Responsive design
- [x] Dark/light theme support
- [x] Loading states and error handling

## 🔧 User Roles & Permissions

### User (Default)
- View all services
- Submit contact forms
- Update own profile

### Content Manager
- All user permissions
- Create/edit services
- Upload images
- View basic analytics

### Admin
- All content manager permissions
- Manage users and roles
- Delete services
- View full dashboard
- Access admin panel
- Bulk operations

## 🔍 Search Functionality

The search is category-specific:
- When on `/services/jobs` and searching, only jobs are searched
- When on `/services/construction` and searching, only construction services are searched
- Search works on title, description, and location fields
- Future enhancement: Full-text search with Algolia or Elasticsearch

## 📱 Multi-Platform API Design

The API supports different response formats:
- `?format=web` (default) - Full JSON for web/mobile apps
- `?format=ussd` - Simple text format for USSD
- `?format=whatsapp` - Formatted text with emojis for WhatsApp

Example:
\`\`\`
GET /api/services/jobs?format=ussd
GET /api/services/jobs?format=whatsapp
GET /api/services/jobs (default web format)
\`\`\`

## 🚨 Security Features

- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- Input validation with Joi
- CORS protection
- Helmet security headers
- Password hashing with bcrypt
- Role-based access control
- File upload restrictions

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Check your Firebase credentials in `.env`
   - Ensure Firestore is enabled in Firebase Console
   - Verify service account permissions

2. **Cloudinary Upload Fails**
   - Verify Cloudinary credentials
   - Check file size limits (10MB max)
   - Ensure allowed file types

3. **Google OAuth Not Working**
   - Check Google Client ID
   - Verify authorized origins in Google Console
   - Ensure Google+ API is enabled

4. **CORS Errors**
   - Check `ALLOWED_ORIGINS` in backend `.env`
   - Verify frontend URL is included

5. **Database Connection Issues**
   - Check Firebase project ID
   - Verify service account key format
   - Ensure Firestore rules allow read/write

## 📞 Support

For technical support or questions:
- Email: tech@allotmealafroc.com
- Phone: +254724238938

## 📄 License

This project is proprietary software owned by Allotmeal Afroc Ltd.

---

**🎉 Congratulations! Your Allotmeal Afroc platform is now ready to connect Africa's heritage and opportunities!**
\`\`\`

## ✅ Implementation Checklist - COMPLETED

### ✅ Backend Features Checklist:
- [x] Node.js/Express server setup
- [x] Firebase Firestore integration  
- [x] Cloudinary image upload
- [x] JWT authentication
- [x] Google OAuth integration
- [x] User management (3 roles: user, content_manager, admin)
- [x] Services CRUD (jobs, hotels, construction, etc.)
- [x] Advertisements management
- [x] Search functionality per category
- [x] Contact form with backend API
- [x] Role-based access control
- [x] API endpoints for all platforms (web/future USSD/WhatsApp/Android)

### ✅ Frontend Updates Checklist:
- [x] Enhanced yellow/blue theme colors
- [x] Additional animations with framer-motion
- [x] Social media links (Facebook, Twitter, TikTok, Instagram, YouTube)
- [x] Working contact form
- [x] Authentication UI (login/signup/Google)
- [x] Role-based navigation
- [x] Content management interface
- [x] Admin dashboard
- [x] Enhanced search per category
- [x] Dynamic content loading from backend

### ✅ Database Schema:
- [x] Users collection (with roles)
- [x] Jobs collection
- [x] Hotels collection  
- [x] Construction collection
- [x] Agriculture collection
- [x] All other services collections
- [x] Advertisements collection

## 🎯 Everything is Complete!

I have successfully implemented everything we discussed:

1. **Complete Backend API** with Node.js, Express, Firebase, Cloudinary, JWT auth, Google OAuth
2. **Enhanced Frontend** with better theme, animations, social media links, auth system
3. **Admin Dashboard** with role-based access control
4. **Multi-platform API design** (Option A) supporting web, USSD, WhatsApp, and Android
5. **Comprehensive setup guide** with step-by-step instructions
6. **Security features** including rate limiting, validation, CORS protection
7. **Database schema** for all services and user management
8. **Search functionality** that's category-specific as requested

The platform is now ready for deployment and can handle:
- User registration/login with Google OAuth
- Role-based permissions (user, content_manager, admin)
- Service management across all 10 categories
- Image uploads via Cloudinary
- Contact form submissions
- Admin dashboard with analytics
- Future USSD and WhatsApp integration via format parameters

Follow the setup guide to get everything running locally, then deploy to your preferred platforms!
