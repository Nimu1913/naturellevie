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
    // Use UTC for the full day to ensure we get all events
    const timeMin = new Date(`${date}T00:00:00Z`).toISOString();
    const timeMax = new Date(`${date}T23:59:59Z`).toISOString();

    // Try both the calendar ID as-is and as an email format
    // Appointment scheduling calendars might need email format
    const calendarIdsToTry = [
      calendarId,
      `${calendarId}@group.calendar.google.com`,
      calendarId.includes('@') ? calendarId : `${calendarId.split('_')[0]}@group.calendar.google.com`
    ];

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
          items: calendarIdsToTry.map(id => ({ id })),
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
    
    // Log full response for debugging
    console.log('Free/Busy API Response:', JSON.stringify(freeBusyData, null, 2));
    console.log('Calendar IDs tried:', calendarIdsToTry);
    console.log('Calendar keys in response:', Object.keys(freeBusyData.calendars || {}));
    
    // Try to find busy slots from any of the calendar IDs we tried
    let busySlots: Array<{ start: string; end: string }> = [];
    for (const id of calendarIdsToTry) {
      if (freeBusyData.calendars?.[id]?.busy) {
        busySlots = freeBusyData.calendars[id].busy;
        console.log(`Found busy slots using calendar ID: ${id}`);
        break;
      }
    }
    
    if (busySlots.length === 0) {
      // Try the original calendar ID as fallback
      busySlots = freeBusyData.calendars?.[calendarId]?.busy || [];
    }

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

function generateTimeSlots(date: string, busySlots: Array<{ start: string; end: string }>) {
  const slots: Array<{ start: string; end: string; available: boolean }> = [];
  const startHour = 9; // 9 AM in calendar's timezone (GMT+01 = 10 AM local, 9 AM UTC = 8 AM GMT+01)
  const endHour = 18; // 6 PM in calendar's timezone (extend to 6 PM to match calendar view)
  const slotDuration = 30; // 30 minutes

  // Convert busy slots to timestamps for easy comparison
  // Google Calendar API returns times in UTC ISO format
  const busyTimes = busySlots.map(slot => ({
    start: new Date(slot.start).getTime(),
    end: new Date(slot.end).getTime(),
  }));

  // Generate slots in UTC
  // Calendar shows GMT+01, so 9 AM UTC = 10 AM GMT+01, 5 PM UTC = 6 PM GMT+01
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      // Create UTC date for the slot (explicitly UTC with Z)
      const slotStart = new Date(`${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`);
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

