import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

const TIME_ZONE = "Europe/Stockholm";
const LOOKAHEAD_DAYS = 14;

function ymdInTZ(date: Date, timeZone: string): string {
  const dtf = new Intl.DateTimeFormat("en-CA", { // en-CA => YYYY-MM-DD
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return dtf.format(date);
}

function weekdayInTZ(dateKey: string, timeZone: string): number {
  // Use noon UTC to avoid date-edge weirdness
  const [y, m, d] = dateKey.split("-").map(Number);
  const noonUTC = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const wd = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(noonUTC);
  return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(wd);
}

function addDaysDateKey(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const base = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const next = new Date(base.getTime() + days * 86400000);
  return ymdInTZ(next, TIME_ZONE);
}

function mondayOfWeek(dateKey: string): string {
  const wd = weekdayInTZ(dateKey, TIME_ZONE); // 0..6
  const daysToMonday = wd === 0 ? 6 : wd - 1;
  return addDaysDateKey(dateKey, -daysToMonday);
}

interface TimeSlotPickerProps {
  packageName: string;
  onTimeSelect: (timeSlot: { start: string; end: string }) => void;
}

export const TimeSlotPicker = ({ packageName, onTimeSelect }: TimeSlotPickerProps) => {
  const { t } = useLanguage();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weekGroups, setWeekGroups] = useState<Array<{ label: string; dates: string[] }>>([]);

  // Build available days from actual availability data
  useEffect(() => {
    let cancelled = false;

    async function buildAvailableDays() {
      const todayKey = ymdInTZ(new Date(), TIME_ZONE);

      // candidate weekday dates (today..+13), skip weekends
      const candidates: string[] = [];
      for (let i = 0; i < LOOKAHEAD_DAYS; i++) {
        const dk = addDaysDateKey(todayKey, i);
        const wd = weekdayInTZ(dk, TIME_ZONE);
        if (wd === 0 || wd === 6) continue; // Sun/Sat
        candidates.push(dk);
      }

      // Fetch availability for each candidate, keep only dates with >= 1 available slot
      const availableDates: string[] = [];
      for (const dk of candidates) {
        try {
          const res = await fetch(`/api/calendar/availability?date=${dk}&package=${packageName}`);
          if (!res.ok) continue;
          const data = await res.json();
          const hasAvail = (data.timeSlots || []).some((s: TimeSlot) => s.available);
          if (hasAvail) availableDates.push(dk);
        } catch {
          // ignore individual failures, keep going
        }
        if (cancelled) return;
      }

      // Group into This week / Next week based on Stockholm week
      const thisMon = mondayOfWeek(todayKey);
      const nextMon = addDaysDateKey(thisMon, 7);
      const thisWeekSet = new Set(Array.from({ length: 5 }, (_, i) => addDaysDateKey(thisMon, i)));
      const nextWeekSet = new Set(Array.from({ length: 5 }, (_, i) => addDaysDateKey(nextMon, i)));

      const thisWeekDates = availableDates.filter(d => thisWeekSet.has(d));
      const nextWeekDates = availableDates.filter(d => nextWeekSet.has(d));

      const groups: Array<{ label: string; dates: string[] }> = [];
      if (thisWeekDates.length) groups.push({ label: "This week", dates: thisWeekDates });
      if (nextWeekDates.length) groups.push({ label: "Next week", dates: nextWeekDates });

      if (!cancelled) {
        setWeekGroups(groups);
        const first = (groups[0]?.dates[0]) || "";
        setSelectedDate(first);
      }
    }

    buildAvailableDays();
    return () => { cancelled = true; };
  }, [packageName]);

  // Fetch available time slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate, packageName]);

  const fetchTimeSlots = async (date: string) => {
    setLoading(true);
    setError(null);
    setSelectedTime(null);

    try {
      const response = await fetch(`/api/calendar/availability?date=${date}&package=${packageName}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', response.status, errorText);
        throw new Error(`Failed to fetch availability (${response.status})`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('API endpoint not configured. Please deploy the Cloudflare Pages function.');
      }

      const data = await response.json();
      setTimeSlots(data.timeSlots || []);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError(err instanceof Error ? err.message : 'Failed to load time slots');
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateKey: string) => {
    const todayKey = ymdInTZ(new Date(), TIME_ZONE);
    const tomorrowKey = addDaysDateKey(todayKey, 1);

    if (dateKey === todayKey) return t.bookingToday || "Today";
    if (dateKey === tomorrowKey) return t.bookingTomorrow || "Tomorrow";

    const [y, m, d] = dateKey.split("-").map(Number);
    const noonUTC = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    return noonUTC.toLocaleDateString("en-US", {
      timeZone: TIME_ZONE,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleTimeSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTime(slot.start);
      onTimeSelect({ start: slot.start, end: slot.end });
    }
  };

  return (
    <div className="w-full">
      {/* Date Selector */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-steel-300 mb-4 uppercase tracking-wider">
          {t.bookingSelectDate || 'Select Date'}
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {weekGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h4 className="text-xs font-medium text-steel-400 mb-3 uppercase tracking-wider">
                {group.label}
              </h4>
              <div className="flex flex-col gap-2">
                {group.dates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm text-left transition-all duration-200 ${
                      selectedDate === date
                        ? 'bg-crystal-blue/20 text-crystal-blue border border-crystal-blue/40'
                        : 'bg-obsidian-800/50 text-steel-400 border border-crystal-edge/10 hover:border-crystal-edge/30 hover:text-steel-300'
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <h3 className="text-sm font-semibold text-steel-300 mb-4 uppercase tracking-wider">
          {t.bookingSelectTime || 'Select Time'}
        </h3>
        
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-steel-500 text-sm">{t.bookingLoading || 'Loading available times...'}</div>
          </div>
        )}

        {error && (
          <div className="text-crystal-red text-sm text-center py-4">
            {error}
          </div>
        )}

        {!loading && !error && timeSlots.length === 0 && (
          <div className="text-steel-500 text-sm text-center py-12">
            {t.bookingNoSlots || 'No available time slots for this date.'}
          </div>
        )}

        {!loading && !error && timeSlots.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => handleTimeSelect(slot)}
                disabled={!slot.available}
                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  !slot.available
                    ? 'bg-obsidian-800/30 text-steel-600 border border-crystal-edge/5 cursor-not-allowed'
                    : selectedTime === slot.start
                    ? 'bg-crystal-blue/20 text-crystal-blue border-2 border-crystal-blue/60 shadow-lg shadow-crystal-blue/10'
                    : 'bg-obsidian-800/50 text-steel-300 border border-crystal-edge/20 hover:border-crystal-blue/40 hover:text-crystal-blue hover:bg-obsidian-800/70'
                }`}
              >
                {formatTime(slot.start)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

