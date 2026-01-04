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

    // Generate time slots based on appointment windows
    const timeSlots = generateTimeSlots(date, busySlots, TIME_ZONE);
    
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


type BusySlot = { start: string; end: string };
type Slot = { start: string; end: string; available: boolean };

const APPOINTMENT_WINDOWS = [
  // Mon-Fri lunchtime: 12:00, 12:30
  { days: [1, 2, 3, 4, 5], start: "12:00", end: "13:00" },
  // Mon-Fri late: 17:30, 18:00
  { days: [1, 2, 3, 4, 5], start: "17:30", end: "18:30" },
];

function weekdayInTimeZone(date: string, timeZone: string): number {
  // Returns 0=Sun..6=Sat for the given date in that timezone
  const [y, m, d] = date.split("-").map(Number);
  const noonUTC = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const wd = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(noonUTC);
  return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(wd);
}

function generateTimeSlots(date: string, busySlots: BusySlot[], timeZone: string): Slot[] {
  const slotMinutes = 30;
  const slots: Slot[] = [];

  const busyTimes = busySlots.map(b => ({
    start: new Date(b.start).getTime(),
    end: new Date(b.end).getTime(),
  }));

  const wd = weekdayInTimeZone(date, timeZone);

  const todaysWindows = APPOINTMENT_WINDOWS.filter(w => w.days.includes(wd));

  for (const w of todaysWindows) {
    const [sh, sm] = w.start.split(":").map(Number);
    const [eh, em] = w.end.split(":").map(Number);

    const startTotal = sh * 60 + sm;
    const endTotal = eh * 60 + em;

    for (let mins = startTotal; mins + slotMinutes <= endTotal; mins += slotMinutes) {
      const hh = String(Math.floor(mins / 60)).padStart(2, "0");
      const mm = String(mins % 60).padStart(2, "0");

      const localStart = `${date}T${hh}:${mm}:00`;
      const startUtcIso = zonedLocalToUtcISO(localStart, timeZone);
      const slotStart = new Date(startUtcIso);
      const slotEnd = new Date(slotStart.getTime() + slotMinutes * 60000);

      const s = slotStart.getTime();
      const e = slotEnd.getTime();

      const isBusy = busyTimes.some(b =>
        (s >= b.start && s < b.end) ||
        (e > b.start && e <= b.end) ||
        (s <= b.start && e >= b.end)
      );

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

