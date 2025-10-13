# Self-Service Advertisement System

## Overview
A complete self-service advertisement platform with M-Pesa payment integration and automatic expiration.

## Features Implemented

### 1. **"Advertise with Us" Banner**
- **Location**: Home page, Featured Advertisements section
- **Link**: `/submit-advertisement`
- **Design**: Eye-catching gradient banner with pricing information (starting at KSh 200/day)

### 2. **Self-Service Advertisement Submission Page**
- **Route**: `/submit-advertisement`
- **Features**:
  - Form to collect advertisement details (title, company, description, contact, location, website)
  - Image upload via Cloudinary (max 5 images)
  - Duration selection with pricing:
    - 1 Day: KSh 200
    - 1 Week: KSh 300
    - 1 Month: KSh 1,000
    - 6 Months: KSh 5,000
    - 1 Year: KSh 10,000
  - M-Pesa payment integration
  - Automatic date calculation based on duration
  - Success confirmation page

### 3. **Payment Integration**
- **M-Pesa STK Push**: Integrated with existing M-Pesa payment system
- **Payment Flow**:
  1. User fills in advertisement details
  2. Selects duration (auto-calculates price)
  3. Clicks "Proceed to Payment"
  4. M-Pesa dialog appears with custom amount
  5. User enters phone number and completes payment
  6. Advertisement is automatically created and activated
- **Transaction Tracking**: All payments saved in `mpesa_transactions` collection
- **Admin Visibility**: Transactions visible in admin M-Pesa dashboard

### 4. **Automatic Expiration System**
- **Netlify Scheduled Function**: `expire-advertisements.js`
- **Schedule**: Runs every hour (cron: `0 * * * *`)
- **Functionality**:
  - Queries all active advertisements with `autoExpires: true`
  - Checks if `endDate` has passed
  - Updates status from `active` to `expired`
  - Logs expiration activity
- **Client-Side Filtering**: FeaturedAdvertisements component filters expired ads in real-time

### 5. **Marketing Dashboard Enhancements**
- **Self-Service Badges**: Advertisements show "Self-Service" badge
- **Payment Status**: Displays payment amount (e.g., "Paid: KSh 300")
- **Expiration Date**: Shows expiry date for self-service ads
- **Status Badges**: Color-coded status (active, expired, pending)
- **Company Display**: Shows company name prominently

## Database Schema

### Advertisement Document (Firestore: `advertisements`)
```typescript
{
  // Existing fields
  id: string
  title: string
  description: string
  company: string
  images: string[]
  adType: "banner" | "featured" | "sponsored" | "popup"
  status: "active" | "suspended" | "pending" | "expired"
  startDate: string (ISO)
  endDate: string (ISO)
  location?: string
  contact?: string
  website?: string
  createdBy: string
  createdAt: string (ISO)
  updatedAt: string (ISO)
  clicks: number
  impressions: number
  
  // New self-service fields
  isSelfService: boolean
  duration: "1day" | "1week" | "1month" | "6months" | "1year"
  paymentAmount: number
  paymentStatus: "pending" | "completed" | "failed"
  transactionId?: string
  mpesaReceiptNumber?: string
  autoExpires: boolean
}
```

## Pricing Structure

| Duration | Price (KSh) | Days |
|----------|-------------|------|
| 1 Day    | 200        | 1    |
| 1 Week   | 300        | 7    |
| 1 Month  | 1,000      | 30   |
| 6 Months | 5,000      | 180  |
| 1 Year   | 10,000     | 365  |

## Files Created/Modified

### New Files
1. **`/app/submit-advertisement/page.tsx`**
   - Self-service advertisement submission form
   - M-Pesa payment integration
   - Image upload functionality
   - Duration/pricing selection

2. **`/netlify/functions/expire-advertisements.js`**
   - Scheduled function to auto-expire advertisements
   - Runs hourly
   - Updates expired advertisements in Firestore

### Modified Files
1. **`/lib/types.ts`**
   - Added self-service fields to Advertisement interface
   - Added "expired" status option

2. **`/components/featured-advertisements.tsx`**
   - Added "Advertise with Us" banner
   - Added client-side expiration filtering
   - Increased query limit to accommodate filtering

3. **`/components/mpesa-payment-dialog.tsx`**
   - Added support for custom amounts (for advertisements)
   - Optional `amount` prop bypasses pricing lookup

4. **`/app/dashboard/marketing/page.tsx`**
   - Added self-service badge display
   - Added payment status display
   - Added expiration date display
   - Enhanced advertisement cards

5. **`/netlify.toml`**
   - Added scheduled function configuration
   - Configured hourly cron job

## User Flow

### Customer Journey
1. **Discovery**: User sees "Advertise with Us" banner on home page
2. **Form**: Clicks and fills in advertisement details
3. **Upload**: Uploads product/service images (max 5)
4. **Duration**: Selects how long to run advertisement
5. **Payment**: Sees total amount, proceeds to M-Pesa payment
6. **Phone**: Enters M-Pesa phone number
7. **Confirmation**: Receives STK push, enters PIN
8. **Success**: Advertisement goes live immediately
9. **Visibility**: Appears on home page and advertisements page
10. **Expiration**: Automatically disappears after duration ends

### Admin View
1. Navigate to Marketing Dashboard
2. Click "Advertisements" tab
3. See all advertisements including self-service ones
4. Self-service ads show:
   - "Self-Service" badge
   - Payment amount badge
   - Expiration date
   - Status (active/expired)
5. Can edit or delete any advertisement
6. View transaction details in Admin > M-Pesa Payments

## How Expiration Works

### Automatic Expiration (Server-Side)
- **Netlify Scheduled Function**: Runs every hour
- **Process**:
  1. Queries `advertisements` collection
  2. Filters for `status === "active"` AND `autoExpires === true`
  3. Compares `endDate` with current time
  4. Updates expired ads to `status: "expired"`
- **Logs**: All activity logged in Netlify function logs

### Client-Side Filtering
- **FeaturedAdvertisements Component**: Filters out expired ads immediately
- **Logic**: Compares `endDate` with current time before displaying
- **Benefit**: Users don't see expired ads even between scheduled runs

## Environment Variables

No additional environment variables required. Uses existing M-Pesa configuration:
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_PASSKEY`
- `MPESA_SHORTCODE`
- `MPESA_BASE_URL`
- Firebase environment variables (already configured)

## Testing Instructions

### Test Self-Service Advertisement
1. Navigate to home page
2. Scroll to "Featured Advertisements" section
3. Click "Get Started" on "Advertise with us" banner
4. Fill in all required fields:
   - Title: "Test Product"
   - Company: "Test Company"
   - Description: "Testing self-service ads"
   - Contact: Your phone number
   - Upload at least 1 image
5. Select duration (e.g., "1 Day")
6. Click "Proceed to Payment"
7. Enter M-Pesa phone number
8. Complete payment on phone
9. Verify success message
10. Check home page - ad should appear

### Test Expiration
**Manual Testing (Immediate)**:
1. Create advertisement with 1 day duration
2. In Firestore, manually change `endDate` to past date
3. Refresh home page - ad should disappear (client-side filter)
4. Wait for next hourly run - status should change to "expired"

**Automatic Testing**:
1. Create advertisement with 1 day duration
2. Wait 24 hours
3. Ad should automatically expire and disappear

### Test Marketing Dashboard
1. Login as marketing or admin user
2. Navigate to Marketing Dashboard
3. Click "Advertisements" tab
4. Verify self-service ads show:
   - "Self-Service" badge
   - Payment amount
   - Expiration date
5. Check expired ads show "expired" status

## Admin M-Pesa Transaction Viewing

All self-service advertisement payments are tracked in the M-Pesa system:

1. **Login** as admin user
2. **Navigate** to Admin Dashboard
3. **Click** "M-Pesa Payments" card
4. **View** "Transactions" tab
5. **Filter** by `serviceType: "advertisement"`
6. **See** all advertisement payment details:
   - Phone number
   - Amount paid
   - Transaction ID
   - M-Pesa receipt number
   - Status (success/failed)
   - Date/time

## Security Considerations

✅ **Payment Verification**: 
- All payments go through M-Pesa STK Push
- Callback verification required
- Transaction status tracked in Firestore

✅ **Data Validation**:
- Required fields enforced
- Image limit enforced (max 5)
- Pricing calculated server-side

✅ **Status Management**:
- Ads start as "pending" until payment completes
- Only "active" ads show on front page
- Automatic expiration prevents expired ads from showing

## Monitoring & Maintenance

### Check Scheduled Function
1. Login to Netlify dashboard
2. Navigate to Functions
3. Click "expire-advertisements"
4. View logs to see hourly execution
5. Verify successful runs (should show "Checked X advertisements, expired Y")

### Monitor Expired Ads
```javascript
// Query Firestore for expired ads
const expiredAds = await getDocs(
  query(
    collection(db, "advertisements"),
    where("status", "==", "expired")
  )
);
```

### Check Payment Issues
1. Admin Dashboard > M-Pesa Payments > Transactions
2. Filter by `status: "failed"` or `status: "pending"`
3. Contact users with failed payments

## Troubleshooting

### Advertisement Not Appearing After Payment
1. Check Firestore: Verify `status: "active"`
2. Check `paymentStatus: "completed"`
3. Check `endDate` is in future
4. Verify `isSelfService: true` and `autoExpires: true`

### Scheduled Function Not Running
1. Check netlify.toml configuration
2. Verify function deployed to Netlify
3. Check Netlify function logs for errors
4. Ensure Firebase credentials in Netlify environment variables

### Payment Completed But Ad Status Still Pending
1. Check callback function logs
2. Verify M-Pesa callback URL whitelisted
3. Check Firestore transaction document
4. Manually update if needed

## Future Enhancements (Optional)

- Email notifications on expiration
- Renewal reminders before expiration
- Analytics dashboard for ad performance
- A/B testing for ad placements
- Bulk discounts for longer durations
- Advertisement preview before payment
- Mobile app support

## Support

For issues or questions:
1. Check Netlify function logs
2. Check Firestore collections
3. Check M-Pesa transaction records
4. Review callback function logs

---

**Last Updated**: January 2025  
**Status**: Fully Implemented and Ready for Production
