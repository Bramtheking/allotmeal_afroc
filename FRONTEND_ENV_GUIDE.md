# 🎨 Frontend Environment Variables Guide

## 🔍 **NEXT_PUBLIC_API_URL**
**What it is**: Where your frontend sends API requests
**Where to get it**: You set this yourself based on deployment

### For Netlify (Frontend + Backend together):
\`\`\`env
NEXT_PUBLIC_API_URL=/.netlify/functions/api
\`\`\`
**Why**: Because your API functions are at `/.netlify/functions/api` on the same domain

### If you used separate backend (like Railway):
\`\`\`env
NEXT_PUBLIC_API_URL=https://your-backend-app.up.railway.app/api
\`\`\`

---

## 🔐 **NEXT_PUBLIC_GOOGLE_CLIENT_ID**
**What it is**: Google OAuth Client ID for frontend login button
**Where to get it**: Same as backend, from Google Cloud Console

### Step-by-Step:
1. **Go to**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Navigate**: APIs & Services → Credentials
3. **Find**: Your OAuth 2.0 Client ID
4. **Copy**: The Client ID (looks like: `123456789-abc...apps.googleusercontent.com`)

\`\`\`env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
\`\`\`

**Note**: This is the SAME value as `GOOGLE_CLIENT_ID` in backend, just with `NEXT_PUBLIC_` prefix

---

## ☁️ **NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME**
**What it is**: Cloudinary cloud name for frontend image uploads
**Where to get it**: Same as backend, from Cloudinary Dashboard

### Step-by-Step:
1. **Go to**: [Cloudinary Dashboard](https://cloudinary.com/console)
2. **Look for**: "Product Environment Credentials" section
3. **Copy**: Cloud name (just the name, not the full URL)

\`\`\`env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
\`\`\`

**Note**: This is the SAME value as `CLOUDINARY_CLOUD_NAME` in backend, just with `NEXT_PUBLIC_` prefix

---

## 🏢 **NEXT_PUBLIC_APP_NAME**
**What it is**: Your app's display name
**Where to get it**: You choose this yourself

\`\`\`env
NEXT_PUBLIC_APP_NAME="Allotmeal Afroc Ltd"
\`\`\`

**You can change this to**:
- `"Allotmeal Afroc"`
- `"Allotmeal Afroc Limited"`
- `"Your Company Name"`
- Whatever you want your app to be called

---

## 🌐 **NEXT_PUBLIC_APP_URL**
**What it is**: Your website's public URL
**Where to get it**: From Netlify after deployment

### Before Deployment (placeholder):
\`\`\`env
NEXT_PUBLIC_APP_URL=https://your-app-name.netlify.app
\`\`\`

### After Netlify Deployment:
1. **Deploy to Netlify**
2. **Netlify gives you a URL** like: `https://amazing-cupcake-123456.netlify.app`
3. **Update this variable** with your real URL:

\`\`\`env
NEXT_PUBLIC_APP_URL=https://amazing-cupcake-123456.netlify.app
\`\`\`

### Custom Domain (Optional):
If you buy a custom domain and connect it to Netlify:
\`\`\`env
NEXT_PUBLIC_APP_URL=https://allotmealafroc.com
\`\`\`

---

## 📋 **Complete Frontend Variables Summary**

\`\`\`env
# API endpoint (same domain for Netlify)
NEXT_PUBLIC_API_URL=/.netlify/functions/api

# Google OAuth (same Client ID as backend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com

# Cloudinary (same cloud name as backend)  
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here

# App info (you choose these)
NEXT_PUBLIC_APP_NAME="Allotmeal Afroc Ltd"
NEXT_PUBLIC_APP_URL=https://your-netlify-url.netlify.app
\`\`\`

---

## 🔄 **Relationship Between Frontend & Backend Variables**

| Frontend Variable | Backend Variable | Source |
|------------------|------------------|---------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `GOOGLE_CLIENT_ID` | Google Cloud Console (same value) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard (same value) |
| `NEXT_PUBLIC_API_URL` | N/A | You set based on deployment |
| `NEXT_PUBLIC_APP_NAME` | N/A | You choose |
| `NEXT_PUBLIC_APP_URL` | N/A | Netlify gives you after deployment |

---

## ⚠️ **Important Notes**

### **NEXT_PUBLIC_ Prefix**
- Variables with `NEXT_PUBLIC_` are visible to browsers
- Never put secrets in `NEXT_PUBLIC_` variables
- That's why we use `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (safe) but not `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET` (secret)

### **Same Values, Different Names**
- `GOOGLE_CLIENT_ID` (backend) = `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (frontend)
- `CLOUDINARY_CLOUD_NAME` (backend) = `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (frontend)

### **API URL for Netlify**
- Always use `/.netlify/functions/api` for Netlify deployment
- This makes API calls go to the same domain (no CORS issues)

---

## 🚀 **Setting Frontend Variables in Netlify**

In Netlify Dashboard → Site Settings → Environment Variables:

\`\`\`env
NEXT_PUBLIC_API_URL=/.netlify/functions/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_from_google_console
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_from_cloudinary
NEXT_PUBLIC_APP_NAME=Allotmeal Afroc Ltd
NEXT_PUBLIC_APP_URL=https://your-actual-netlify-url.netlify.app
\`\`\`

**Remember**: Update `NEXT_PUBLIC_APP_URL` with your real Netlify URL after first deployment!
