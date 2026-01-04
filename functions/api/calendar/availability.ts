const TIME_ZONE = "Europe/Stockholm";

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  // Offset = (time interpreted in tz as UTC) - actual UTC time
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = dtf.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) if (p.type !== "literal") map[p.type] = p.value;

  const asUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );

  return asUTC - date.getTime();
}

// Convert "YYYY-MM-DDTHH:mm:ss" which is in TIME_ZONE into a UTC ISO string.
function zonedLocalToUtcISO(localDateTime: string, timeZone: string): string {
  const [d, t] = localDateTime.split("T");
  const [y, m, day] = d.split("-").map(Number);
  const [hh, mm, ss = "0"] = t.split(":");
  const approx = new Date(Date.UTC(y, m - 1, day, Number(hh), Number(mm), Number(ss)));
  const offset = getTimeZoneOffsetMs(approx, timeZone);
  return new Date(approx.getTime() - offset).toISOString();
}

function corsJson() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };
}

export async function onRequestGet({ request, env }: { request: Request; env: { GOOGLE_CALENDAR_API_KEY?: string; GOOGLE_CALENDAR_ID?: string } }) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const packageName = url.searchParams.get('package');

    if (!date) {
      return new Response(
        JSON.stringify({ error: 'Date parameter is required' }),
        { 
          status: 400, 
          headers: corsJson()
        }
      );
    }

    const calendarId = env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      return new Response(
        JSON.stringify({
          error: "GOOGLE_CALENDAR_ID not configured",
          details: "Set GOOGLE_CALENDAR_ID to your Calendar ID (looks like xxx@group.calendar.google.com or your email)."
        }),
        { status: 500, headers: corsJson() }
      );
    }
    
    // Check if Google Calendar API key is configured
    if (!env.GOOGLE_CALENDAR_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'Google Calendar API key not configured',
          details: 'GOOGLE_CALENDAR_API_KEY environment variable is missing. Set it in Cloudflare Pages → Settings → Environment Variables.'
        }),
        { 
          status: 500, 
          headers: corsJson()
        }
      );
    }

    // Fetch free/busy information from Google Calendar
    // Use Europe/Stockholm timezone to match the calendar
    const timeMin = zonedLocalToUtcISO(`${date}T00:00:00`, TIME_ZONE);
    const timeMax = zonedLocalToUtcISO(`${date}T23:59:59`, TIME_ZONE);

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
          timeZone: TIME_ZONE,
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
          headers: corsJson()
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
        headers: corsJson()
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
        headers: corsJson()
      }
    );
  }
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
      const slotStartUTC = zonedLocalToUtcISO(stockholmTime, TIME_ZONE);
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

