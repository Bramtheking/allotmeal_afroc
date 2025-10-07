# AllotMeal Afroc Ltd - Business Services Platform

## Overview

AllotMeal Afroc Ltd is a comprehensive business services platform designed to connect various stakeholders across Africa's business ecosystem. The platform serves as a hub for hotel and hospitality services, job opportunities, construction projects, agricultural products, entertainment, education, health services, transport, SME products, tenders, and religious content. Built as a modern web application, it features role-based access control, content management capabilities, and a service marketplace that connects service providers with customers across multiple business sectors.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### October 5, 2025
- **M-Pesa STK Push Payment Integration**: Implemented complete mobile money payment system using M-Pesa STK Push API. Payment flow intercepts "Continue" and "Videos" actions in service sections, requiring payment before granting access to content.
- **Netlify Functions for Payment Processing**: Created serverless functions for STK Push initiation, OAuth token generation, and payment callback handling with Firebase transaction updates.
- **Payment Verification System**: Implemented real-time transaction polling to verify actual payment success (ResultCode === 0) before allowing content access. Failed or cancelled payments are properly blocked.
- **Admin Payment Controls**: Added comprehensive admin dashboard for M-Pesa management including service pricing configuration, phone/email whitelist management, global pause/resume toggle, and transaction history with CSV export.
- **Whitelist Bypass Logic**: Implemented smart bypass system that checks user email and phone number against whitelist, allowing authorized users to access content without payment.

### September 6, 2025
- **Fixed Service Data Retrieval**: Fixed all broken services (construction, SME products, health, entertainment) to properly fall back to mock data when Firebase is unavailable, ensuring all service categories display content correctly.
- **Implemented Manual Visitor Tracking**: Replaced Firebase-based visitor counting with a manual, localStorage-based system that only counts unique visitors (no page reloads). The system uses browser storage to track first-time visits and prevent duplicate counting.
- **Enhanced Analytics Dashboard**: Created comprehensive analytics system with visitor statistics grouped by days, weeks, months, and years. Added dedicated analytics page (/analytics) with detailed charts and visual representations.
- **Updated Admin Dashboard**: Modified admin dashboard to use manual visitor statistics and clearly indicate "unique visitors only" for accurate tracking metrics.

## System Architecture

### Frontend Architecture
The application is built using Next.js 14 with the App Router pattern, providing server-side rendering and modern React features. The UI is constructed using shadcn/ui components built on Radix UI primitives, offering a consistent and accessible design system. Tailwind CSS handles styling with a custom design system featuring yellow and blue brand colors. Framer Motion provides smooth animations and transitions throughout the user interface. The application follows a component-based architecture with reusable UI components and proper separation of concerns.

### Manual Visitor Tracking System
The platform implements a manual visitor counting system that stores data locally in browser localStorage. This system only counts unique visitors (not page reloads) and provides accurate metrics for website traffic. Key features:
- **Unique Visit Detection**: Uses localStorage to identify first-time visitors vs. returning visitors
- **No Duplicate Counting**: Page reloads and navigation within the same browser session don't increment visitor count
- **Comprehensive Analytics**: Groups visitor data by daily, weekly, monthly, and yearly periods
- **Real-time Dashboard**: Provides visual charts and statistics accessible via /analytics page
- **Local Storage Based**: Independent of Firebase connectivity, ensuring consistent tracking

### Authentication & Authorization System
Firebase Authentication handles user management with support for both email/password authentication and Google OAuth integration. The system implements a three-tier role-based access control: regular users, marketing users (who can manage services and advertisements), and administrators (who have full system access). User profiles are automatically created in Firestore upon registration, storing role information and user metadata. The authentication context provides global state management for user sessions and role-based routing.

### Database & Data Management
Firestore serves as the primary database, storing user profiles, services, and advertisements in separate collections. The database schema supports rich content including images, videos, and YouTube links for services and advertisements. Security rules enforce role-based access control at the database level, ensuring users can only access data appropriate to their role. Services and advertisements support various metadata including location, pricing, company information, and status tracking.

### Content Management System
The platform includes a comprehensive content management system allowing marketing and admin users to create, update, and manage services across 11 different categories. Each service supports multiple media types including images, videos, and YouTube links. The system includes status management (active, suspended, pending) and proper audit trails with created/updated timestamps and user tracking.

### Service Categories & Features
The platform organizes services into distinct categories: Hotel & Industry, Jobs, Construction, Agriculture, Entertainment, SME Products, Tenders, Education, Health, Transport, and Sermon content. Each category has specialized fields and presentation logic. The services section features modern, animated cards with hover effects, responsive grid layouts, and category-specific routing.

### M-Pesa Payment Integration
The platform integrates M-Pesa STK Push for mobile money payments. When users attempt to access premium content (Continue/Videos), the system checks whitelist status and payment settings before requiring payment. The flow includes:
- **Netlify Functions**: Serverless functions handle STK Push initiation (`stkPush.js`), OAuth token generation (`mpesa-utils.js`), and payment callbacks (`callback.js`)
- **Transaction Polling**: Client-side payment dialog polls Firebase every 3 seconds to verify actual payment completion via M-Pesa callback updates
- **Whitelist System**: Admin-managed whitelist for phone numbers and email addresses to bypass payment requirements
- **Admin Controls**: Configure service-specific pricing, manage whitelist, pause/resume payments globally, and view/export transaction history
- **Firebase Collections**: `mpesa_settings`, `mpesa_service_pricing`, `mpesa_whitelist`, and `mpesa_transactions` store all payment-related data

**Callback URL for Safaricom:** `https://allotmealafroc.netlify.app/.netlify/functions/callback`

### Responsive Design System
The application implements a mobile-first responsive design with dedicated mobile navigation, touch-friendly interactions, and optimized layouts for various screen sizes. The theme system supports both light and dark modes with consistent color schemes and proper contrast ratios.

## External Dependencies

### Firebase Services
- **Firebase Authentication** - User authentication with email/password and Google OAuth
- **Firestore Database** - Primary data storage for users, services, and advertisements
- **Firebase Storage** - File storage for media assets

### Media Management
- **Cloudinary** - Image and video hosting, processing, and delivery with automatic optimization and thumbnail generation

### UI Framework
- **shadcn/ui** - Component library built on Radix UI primitives
- **Radix UI** - Accessible UI component primitives
- **Tailwind CSS** - Utility-first CSS framework for styling

### Animation & Interaction
- **Framer Motion** - Animation library for smooth transitions and interactions
- **React Intersection Observer** - Scroll-based animations and lazy loading

### Form Handling
- **React Hook Form** - Form state management and validation
- **Zod** - Schema validation for form inputs

### Development Tools
- **TypeScript** - Type safety and enhanced developer experience
- **Next.js** - React framework with App Router and server-side rendering
- **ESLint** - Code linting and quality assurance
