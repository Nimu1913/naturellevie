export async function onRequestGet({ request, env }: { request: Request; env: { GOOGLE_CALENDAR_API_KEY?: string; GOOGLE_CALENDAR_ID?: string } }) {
  // Default to the provided calendar link ID if no calendar ID is set
  // The link format is calendar.app.google/P2ZUYqNgPQnfZvtt7
  // This typically maps to: P2ZUYqNgPQnfZvtt7@group.calendar.google.com
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const packageName = url.searchParams.get('package');

    if (!date) {
      return new Response(
        JSON.stringify({ error: 'Date parameter is required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      );
    }

    // Default calendar ID - can be overridden by env variable
    const calendarId = env.GOOGLE_CALENDAR_ID || 'AcZssZ0vdRutz7B1dwX05rIbShf_sxp4YE4dzvqt7PI6bZoDimXEHay0RWscO8yEclbV87_ScSbiZ_T3';
    
    // Check if Google Calendar API key is configured
    if (!env.GOOGLE_CALENDAR_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'Google Calendar API key not configured',
          details: 'GOOGLE_CALENDAR_API_KEY environment variable is missing. Set it in Cloudflare Pages → Settings → Environment Variables.'
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      );
    }

    // Fetch free/busy information from Google Calendar
    // Use Europe/Stockholm timezone to match the calendar
    const timeZone = 'Europe/Stockholm';
    
    // Create date range for the full day in Stockholm timezone
    // Convert Stockholm midnight to UTC
    const stockholmMidnight = `${date}T00:00:00`;
    const stockholmEndOfDay = `${date}T23:59:59`;
    
    // Helper to convert Stockholm time to UTC ISO
    const timeMin = stockholmToUTC(stockholmMidnight);
    const timeMax = stockholmToUTC(stockholmEndOfDay);

    const freeBusyResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/freeBusy?key=${env.GOOGLE_CALENDAR_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeMin,
          timeMax,
          timeZone: timeZone,
          items: [{ id: calendarId }],
        }),
      }
    );

    if (!freeBusyResponse.ok) {
      const errorText = await freeBusyResponse.text();
      console.error('Google Calendar API error:', errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch calendar availability',
          details: errorText
        }),
        { 
          status: 502, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      );
    }

    const freeBusyData = await freeBusyResponse.json();
    
    // Log response for debugging
    console.log('Free/Busy API Response:', JSON.stringify(freeBusyData, null, 2));
    console.log('Calendar ID used:', calendarId);
    console.log('Calendar keys in response:', Object.keys(freeBusyData.calendars || {}));
    
    const busySlots = freeBusyData.calendars?.[calendarId]?.busy || [];

    // Log busy slots for debugging
    console.log(`Found ${busySlots.length} busy slot(s) for date ${date}`);
    if (busySlots.length > 0) {
      console.log('Busy slots:', busySlots.map(slot => ({
        start: new Date(slot.start).toISOString(),
        end: new Date(slot.end).toISOString(),
        startLocal: new Date(slot.start).toLocaleString('en-US', { timeZone: 'Europe/Stockholm' }),
        endLocal: new Date(slot.end).toLocaleString('en-US', { timeZone: 'Europe/Stockholm' }),
      })));
    } else {
      console.log('No busy slots found - all times may appear available');
    }

    // Generate 30-minute time slots from 9 AM to 6 PM UTC (10 AM to 7 PM GMT+01)
    const timeSlots = generateTimeSlots(date, busySlots);
    
    // Log generated slots summary
    const availableCount = timeSlots.filter(s => s.available).length;
    const unavailableCount = timeSlots.filter(s => !s.available).length;
    console.log(`Generated ${timeSlots.length} slots: ${availableCount} available, ${unavailableCount} unavailable`);

    return new Response(
      JSON.stringify({ timeSlots }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching calendar availability:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch availability',
        details: errorMessage
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  }
}

// Helper to convert Stockholm time string (YYYY-MM-DDTHH:mm:ss) to UTC ISO string
function stockholmToUTC(stockholmTime: string): string {
  // Parse the date/time
  const [datePart, timePart] = stockholmTime.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second = 0] = timePart.split(':').map(Number);
  
  // Create a date object assuming it's in Stockholm timezone
  // We'll use a trick: create date in UTC, then adjust for Stockholm offset
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  
  // Get Stockholm offset for this date (handles DST)
  const offset = getStockholmOffsetMinutes(utcDate);
  
  // Adjust UTC date by subtracting the offset (Stockholm is ahead of UTC)
  const adjustedDate = new Date(utcDate.getTime() - offset * 60000);
  return adjustedDate.toISOString();
}

// Helper to get Stockholm timezone offset in minutes from UTC
function getStockholmOffsetMinutes(date: Date): number {
  // Stockholm is UTC+1 in winter (CET), UTC+2 in summer (CEST)
  // DST: last Sunday in March to last Sunday in October
  // For January (month 0), it's winter: UTC+1 = -60 minutes
  const month = date.getUTCMonth(); // 0-11
  const isDST = month >= 2 && month <= 9; // March (2) to October (9)
  return isDST ? -120 : -60; // UTC+2 = -120 min, UTC+1 = -60 min
}

function generateTimeSlots(date: string, busySlots: Array<{ start: string; end: string }>) {
  const slots: Array<{ start: string; end: string; available: boolean }> = [];
  const startHour = 9; // 9 AM in Stockholm timezone
  const endHour = 19; // 7 PM in Stockholm timezone (to cover 6:00pm slots)
  const slotDuration = 30; // 30 minutes

  // Convert busy slots to timestamps for easy comparison
  // Google Calendar API returns times in UTC ISO format
  const busyTimes = busySlots.map(slot => ({
    start: new Date(slot.start).getTime(),
    end: new Date(slot.end).getTime(),
  }));

  // Generate slots in Stockholm timezone, convert to UTC
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      // Create Stockholm time string
      const stockholmTime = `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
      
      // Convert to UTC
      const slotStartUTC = stockholmToUTC(stockholmTime);
      const slotStart = new Date(slotStartUTC);
      const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);
      
      // Check if slot overlaps with any busy time (all in UTC milliseconds)
      const slotStartTime = slotStart.getTime();
      const slotEndTime = slotEnd.getTime();
      
      const isBusy = busyTimes.some(busy => 
        (slotStartTime >= busy.start && slotStartTime < busy.end) ||
        (slotEndTime > busy.start && slotEndTime <= busy.end) ||
        (slotStartTime <= busy.start && slotEndTime >= busy.end)
      );

      // Return in UTC ISO format - frontend will convert to user's local timezone for display
      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        available: !isBusy,
      });
    }
  }

  return slots;
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

