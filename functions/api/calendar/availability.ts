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
    const calendarId = env.GOOGLE_CALENDAR_ID || '07hdposfkpoee6qag83r3itrf2_aW5mb29ic2lkaWFucGVha3NAZ21haWwuY29t';
    
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
    const timeMin = new Date(`${date}T00:00:00Z`).toISOString();
    const timeMax = new Date(`${date}T23:59:59Z`).toISOString();

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
    const busySlots = freeBusyData.calendars[calendarId]?.busy || [];

    // Generate 30-minute time slots from 9 AM to 5 PM
    const timeSlots = generateTimeSlots(date, busySlots);

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
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  const slotDuration = 30; // 30 minutes

  // Convert busy slots to timestamps for easy comparison
  const busyTimes = busySlots.map(slot => ({
    start: new Date(slot.start).getTime(),
    end: new Date(slot.end).getTime(),
  }));

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const slotStart = new Date(`${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
      const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);
      
      // Check if slot overlaps with any busy time
      const slotStartTime = slotStart.getTime();
      const slotEndTime = slotEnd.getTime();
      
      const isBusy = busyTimes.some(busy => 
        (slotStartTime >= busy.start && slotStartTime < busy.end) ||
        (slotEndTime > busy.start && slotEndTime <= busy.end) ||
        (slotStartTime <= busy.start && slotEndTime >= busy.end)
      );

      // Use UTC timezone for consistency
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

