# Google Calendar Integration Setup

## Overview

The booking page integrates with Google Calendar to show your available time slots. The system fetches your calendar's free/busy information and displays available 30-minute slots from 9 AM to 5 PM.

## Setup Steps

### 1. Google Calendar API Setup

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com/
   - Create a new project or select an existing one

2. **Enable Google Calendar API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

3. **Create API Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key
   - (Optional) Restrict the API key to "Google Calendar API" for security

4. **Get Your Calendar ID**
   - Your calendar ID: `AcZssZ0vdRutz7B1dwX05rIbShf_sxp4YE4dzvqt7PI6bZoDimXEHay0RWscO8yEclbV87_ScSbiZ_T3`
   - This is already set as the default in the code
   - To override, set `GOOGLE_CALENDAR_ID` environment variable in Cloudflare Pages

### 2. Cloudflare Pages Environment Variables

Add these environment variables in Cloudflare Pages:

1. Go to your Cloudflare Pages project
2. Navigate to "Settings" → "Environment Variables"
3. Add the following:

```
GOOGLE_CALENDAR_API_KEY=your_api_key_here
GOOGLE_CALENDAR_ID=your_calendar_id_here
```

### 3. How It Works

- **Availability Endpoint**: `/api/calendar/availability`
  - Fetches free/busy information from Google Calendar
  - Generates 30-minute time slots (9 AM - 5 PM)
  - Marks slots as unavailable if they overlap with existing events

- **Booking Endpoint**: `/api/calendar/booking`
  - Receives booking details (name, email, time slot, package)
  - Sends confirmation email via Resend
  - (Future: Creates calendar event automatically)

### 4. Deployment Required

**IMPORTANT:** Cloudflare Pages functions only work when deployed to Cloudflare Pages, not in local development.

- Functions are automatically deployed when you push to your connected Git repository
- The function at `functions/api/calendar/availability.ts` will be available at `/api/calendar/availability` after deployment
- If you see "API endpoint not configured" error, the function hasn't been deployed yet
- Push your code to trigger a new deployment

### 5. Timezone Handling

- All times are stored in UTC
- The frontend converts to user's local timezone for display
- Make sure your Google Calendar timezone matches your business hours

### 6. Future Enhancements

- Automatic calendar event creation on booking
- Email calendar invites to both parties
- Support for multiple calendars
- Customizable time slot duration
- Business hours configuration

## Testing

1. **Without API Key** (Development):
   - The system will show mock time slots
   - All functionality works except real calendar integration

2. **With API Key** (Production):
   - Deploy to Cloudflare Pages with environment variables
   - Test booking flow end-to-end
   - Verify calendar events don't overlap

## Troubleshooting

**"API endpoint not configured" error:**
- The function hasn't been deployed yet - push your code to trigger a deployment
- Verify the function exists at `functions/api/calendar/availability.ts`
- Check Cloudflare Pages → Functions tab to see if the function is listed
- Wait a few minutes after deployment for functions to be available

**No time slots showing:**
- Check that `GOOGLE_CALENDAR_API_KEY` is set correctly in Cloudflare Pages environment variables
- Verify `GOOGLE_CALENDAR_ID` matches your calendar
- Check browser console for API errors
- Verify the function is deployed (check Cloudflare Pages → Deployments)

**All slots showing as unavailable:**
- Your calendar might be fully booked
- Check Google Calendar for existing events
- Verify API key has correct permissions

**API errors:**
- Ensure Google Calendar API is enabled in Google Cloud Console
- Check API key restrictions
- Verify calendar ID format (usually email address)

