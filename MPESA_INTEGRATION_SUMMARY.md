# M-Pesa STK Push Integration Summary

## Overview
This document provides critical information about the M-Pesa STK Push payment integration implemented on your platform.

## Callback URL for Safaricom

When applying for M-Pesa live credentials from Safaricom, provide this callback URL:

```
https://allotmealafroc.netlify.app/.netlify/functions/callback
```

**Important:** This URL must be whitelisted by Safaricom for callbacks to work in production.

## Environment Variables Required

### On Netlify
The following environment variables must be configured in your Netlify dashboard:

#### M-Pesa Credentials
- `MPESA_CONSUMER_KEY` - Your M-Pesa API consumer key
- `MPESA_CONSUMER_SECRET` - Your M-Pesa API consumer secret
- `MPESA_PASSKEY` - The passkey for STK Push requests
- `MPESA_SHORTCODE` - Your M-Pesa business shortcode (Paybill or Till Number)
- `MPESA_BASE_URL` - The M-Pesa API base URL
  - Sandbox: `https://sandbox.safaricom.co.ke`
  - Production: `https://api.safaricom.co.ke`

#### Firebase Credentials (for callback function)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## How the Payment Flow Works

### 1. User Initiates Payment
- User clicks "Learn More" on any service
- Selects "Continue" or "Videos"
- System checks if payment is required

### 2. Whitelist & Bypass Checks
- Checks if M-Pesa is globally paused (admin setting)
- Checks if user's email is whitelisted
- Checks if phone number is whitelisted
- Checks if service has pricing configured
- If any bypass condition is met, user proceeds without payment

### 3. Payment Request
- User enters phone number
- STK Push is initiated via Netlify Function
- Transaction record created in Firebase with "pending" status
- User receives M-Pesa prompt on their phone

### 4. Payment Verification
- UI polls Firebase every 3 seconds for status update
- M-Pesa callback updates transaction status in Firebase
- On success (ResultCode = 0): User proceeds to content
- On failure/cancel: User sees error and can retry
- Timeout after 60 seconds (20 polls × 3 seconds)

### 5. Admin Dashboard
- View all transactions with filtering
- Export to CSV
- Configure service pricing
- Manage whitelist (phone/email)
- Pause/Resume payments globally

## Firebase Collections Created

### `mpesa_settings`
Stores global M-Pesa configuration:
- `isPaused` (boolean) - Global payment pause toggle
- `updatedAt` (timestamp)
- `updatedBy` (user ID)

### `mpesa_service_pricing`
Stores pricing per service type:
- `serviceType` (string) - e.g., "hotel-industry", "jobs"
- `continueAmount` (number) - Price for Continue action
- `videosAmount` (number) - Price for Videos action
- `updatedAt` (timestamp)
- `updatedBy` (user ID)

### `mpesa_whitelist`
Stores whitelisted users:
- `type` ("phone" | "email")
- `value` (string) - Phone number or email
- `addedAt` (timestamp)
- `addedBy` (user ID)
- `deleted` (boolean) - Soft delete flag

### `mpesa_transactions`
Stores all payment transactions:
- `merchantRequestId` (string)
- `checkoutRequestId` (string)
- `phoneNumber` (string)
- `amount` (number)
- `serviceType` (string)
- `actionType` ("Continue" | "Videos")
- `userId` (string)
- `userEmail` (string)
- `resultCode` (number) - 0 = success, other = failed
- `resultDesc` (string) - M-Pesa response message
- `mpesaReceiptNumber` (string) - M-Pesa transaction ID
- `transactionDate` (string)
- `timestamp` (timestamp)
- `status` ("pending" | "success" | "failed")

## Testing

### Sandbox Testing
Current sandbox credentials are configured. Test with:
- Phone: 254708374149 (or any Safaricom test number)
- Amount: Any amount between 1-70000

### Moving to Production
1. Apply for M-Pesa live credentials from Safaricom
2. Provide the callback URL (see above)
3. Update environment variables on Netlify:
   - Replace all M-Pesa credentials with live values
   - Change `MPESA_BASE_URL` to `https://api.safaricom.co.ke`
4. Test with real money (start with small amounts)

## Admin Access

Admin users can access M-Pesa management via:
1. Login as admin
2. Navigate to Admin Dashboard
3. Click "M-Pesa Payments" card
4. Configure settings, whitelist, and view transactions

## Service Types Supported

All 11 service types support M-Pesa payments:
1. Hotel & Industry (hotel-industry)
2. Jobs (jobs)
3. Construction (construction)
4. Agriculture (agriculture)
5. Entertainment (entertainment)
6. SME Products (sme-products)
7. Tenders (tenders)
8. Education (education)
9. Health (health)
10. Transport (transport)
11. Sermon (sermon)

Each can have different pricing for "Continue" and "Videos" actions.

## Support & Troubleshooting

### Common Issues

**Payment not processing:**
- Check Netlify function logs
- Verify all environment variables are set
- Ensure callback URL is whitelisted with Safaricom
- Check Firebase connection

**Callback not received:**
- Verify callback URL with Safaricom
- Check Netlify function logs
- Ensure Firebase env vars are set in Netlify

**Transaction stuck in pending:**
- Check M-Pesa callback was received (Netlify logs)
- Verify Firebase is accessible from Netlify functions
- Transaction will timeout after 60 seconds

### Monitoring
- Check `/dashboard/admin/mpesa/transactions` for transaction history
- Monitor Netlify function logs for callback processing
- Review browser console for client-side errors

## Security Considerations

✅ Implemented:
- Environment variables for sensitive data
- Server-side payment processing
- Transaction verification before granting access
- Whitelist for authorized users
- Admin-only access to settings

⚠️ Recommendations:
- Regularly audit whitelist entries
- Monitor for suspicious transaction patterns
- Keep Firebase security rules updated
- Use HTTPS only (enforced by Netlify)

## Files Modified/Created

### Netlify Functions
- `netlify/functions/mpesa-utils.js` - Shared utilities
- `netlify/functions/stkPush.js` - STK Push initiator
- `netlify/functions/callback.js` - M-Pesa callback handler
- `netlify.toml` - Netlify configuration

### Firebase Integration
- `lib/mpesa-firebase.ts` - Firebase helper functions

### UI Components
- `components/mpesa-payment-dialog.tsx` - Payment UI
- `components/service-options-dialog.tsx` - Updated with payment flow

### Admin Dashboard
- `app/dashboard/admin/mpesa/page.tsx` - Settings management
- `app/dashboard/admin/mpesa/transactions/page.tsx` - Transaction history
- `app/dashboard/admin/page.tsx` - Added M-Pesa navigation

## Next Steps

1. ✅ Code implementation complete
2. ⏳ Test in sandbox environment (on Netlify)
3. ⏳ Apply for live M-Pesa credentials
4. ⏳ Update environment variables to production
5. ⏳ Test with real transactions
6. ⏳ Monitor and optimize based on usage

---

**Last Updated:** October 5, 2025
**Integration Status:** Development Complete, Pending Deployment Testing
