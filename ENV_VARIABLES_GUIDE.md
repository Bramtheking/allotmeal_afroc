# 🔑 Complete Environment Variables Guide

## 📋 Where to Get Every Single Environment Variable

### 🎯 **NODE_ENV** 
**What it is**: Tells your app if it's running in development or production
**Where to get it**: You set this yourself
- **For Netlify (production)**: `NODE_ENV=production` ✅
- **For local development**: `NODE_ENV=development`
- **Always use "production" for live deployment**

### 🔐 **JWT_SECRET**
**What it is**: Secret key to encrypt user login tokens
**Where to get it**: You create this yourself
**How to create**:
\`\`\`bash
# Option 1: Generate random string online
# Go to: https://generate-secret.vercel.app/32

# Option 2: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: Make up a long random string (32+ characters)
JWT_SECRET=your_super_secret_jwt_key_make_it_very_long_and_random_123456789
\`\`\`

---

## 🔥 **FIREBASE VARIABLES** (Database)

### Step-by-Step Firebase Setup:

1. **Go to**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. **Click**: "Create a project" or "Add project"
3. **Name**: "allotmeal-afroc" (or any name you want)
4. **Enable**: Google Analytics (optional)
5. **Click**: "Create project"

### Enable Firestore Database:
1. **In Firebase Console**: Click "Firestore Database"
2. **Click**: "Create database"
3. **Choose**: "Start in test mode" (for now)
4. **Select**: Your preferred location

### Get Firebase Credentials:
1. **Go to**: Project Settings (gear icon) → "Service accounts"
2. **Click**: "Generate new private key"
3. **Download**: The JSON file
4. **Open the JSON file** and extract these values:

\`\`\`json
{
  "type": "service_account",
  "project_id": "your-project-id-here", // ← FIREBASE_PROJECT_ID
  "private_key_id": "abc123...", // ← FIREBASE_PRIVATE_KEY_ID
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n", // ← FIREBASE_PRIVATE_KEY
  "client_email": "firebase-adminsdk-...@your-project.iam.gserviceaccount.com", // ← FIREBASE_CLIENT_EMAIL
  "client_id": "123456789", // ← FIREBASE_CLIENT_ID
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..." // ← FIREBASE_CLIENT_CERT_URL
}
\`\`\`

**Environment Variables**:
\`\`\`env
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_PRIVATE_KEY_ID=abc123def456...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789012345
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xyz%40your-project.iam.gserviceaccount.com
\`\`\`

---

## ☁️ **CLOUDINARY VARIABLES** (Image Storage)

### Step-by-Step Cloudinary Setup:

1. **Go to**: [https://cloudinary.com/](https://cloudinary.com/)
2. **Click**: "Sign Up Free"
3. **Fill**: Your details and verify email
4. **Go to**: Dashboard (after login)
5. **Copy**: These values from the dashboard:

\`\`\`
Cloud name: your_cloud_name_here
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz123456
\`\`\`

**Environment Variables**:
\`\`\`env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
\`\`\`

---

## 🔐 **GOOGLE OAUTH VARIABLES** (Login with Google)

### Step-by-Step Google OAuth Setup:

1. **Go to**: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. **Create**: New project or select existing
3. **Enable**: Google+ API
   - Go to "APIs & Services" → "Library"
   - Search "Google+ API" → Enable it
4. **Create**: OAuth 2.0 Credentials
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - **Name**: "Allotmeal Afroc Web App"
   - **Authorized origins**: 
     - `http://localhost:3000` (for development)
     - `https://your-app-name.netlify.app` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/google/callback`
     - `https://your-app-name.netlify.app/api/auth/google/callback`

5. **Copy**: Client ID and Client Secret

**Environment Variables**:
\`\`\`env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
\`\`\`

---

## 📧 **EMAIL VARIABLES** (Contact Form - Optional)

### Option 1: Gmail App Password (Recommended)

1. **Go to**: [https://myaccount.google.com/](https://myaccount.google.com/)
2. **Enable**: 2-Step Verification (if not already)
3. **Go to**: Security → 2-Step Verification → App passwords
4. **Generate**: App password for "Mail"
5. **Copy**: The 16-character password

**Environment Variables**:
\`\`\`env
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # (16-character app password)
ADMIN_EMAIL=admin@allotmealafroc.com  # (where contact forms are sent)
\`\`\`

### Option 2: Skip Email (Contact form won't work)
\`\`\`env
# Leave these empty or don't set them
EMAIL_USER=
EMAIL_PASS=
ADMIN_EMAIL=
\`\`\`

---

## 🌐 **FRONTEND VARIABLES** (Next.js)

These are for your frontend (Next.js) - they start with `NEXT_PUBLIC_`:

\`\`\`env
# API URL - This stays the same for Netlify
NEXT_PUBLIC_API_URL=/.netlify/functions/api

# Google OAuth (same Client ID as backend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com

# Cloudinary (same Cloud Name as backend)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here

# App Information (you choose these)
NEXT_PUBLIC_APP_NAME="Allotmeal Afroc Ltd"
NEXT_PUBLIC_APP_URL=https://your-app-name.netlify.app
\`\`\`

---

## 📝 **COMPLETE .env.local FILE** (For Local Development)

Create this file in your project root:

\`\`\`env
# Frontend Variables
NEXT_PUBLIC_API_URL=/.netlify/functions/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_APP_NAME="Allotmeal Afroc Ltd"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend Variables (for Netlify Functions)
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_make_it_very_long_and_random

# Firebase
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=your_client_cert_url

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (Optional)
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@allotmealafroc.com
\`\`\`

---

## 🚀 **NETLIFY ENVIRONMENT VARIABLES**

In Netlify Dashboard → Site Settings → Environment Variables, add ALL the variables above, but change:

\`\`\`env
NODE_ENV=production  # ← Change to production for live site
NEXT_PUBLIC_APP_URL=https://your-actual-netlify-url.netlify.app  # ← Your real Netlify URL
\`\`\`

---

## ✅ **FINAL CHECKLIST**

- [ ] Firebase project created and Firestore enabled
- [ ] Firebase service account JSON downloaded
- [ ] Cloudinary account created
- [ ] Google OAuth credentials created
- [ ] Gmail app password generated (optional)
- [ ] All environment variables set in Netlify
- [ ] `NODE_ENV=production` for Netlify deployment
- [ ] Google OAuth authorized origins include your Netlify URL

---

## 🆘 **If You Get Stuck**

1. **Firebase issues**: Make sure Firestore is enabled and service account has proper permissions
2. **Google OAuth issues**: Check authorized origins match your exact domain
3. **Cloudinary issues**: Verify cloud name, API key, and secret are correct
4. **Email issues**: Use Gmail app password, not regular password

**Remember**: 
- `NODE_ENV=production` for live deployment ✅
- `NODE_ENV=development` for local testing ✅
