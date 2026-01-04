import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
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

  // Generate this week and next week grouped by week
  useEffect(() => {
    const today = new Date();
    const groups: Array<{ label: string; dates: string[] }> = [];
    
    // Get the start of this week (Monday)
    const thisMonday = new Date(today);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Days to go back to Monday
    thisMonday.setDate(today.getDate() - daysToMonday);
    thisMonday.setHours(0, 0, 0, 0);
    
    // Generate dates for this week (Mon-Fri)
    const thisWeekDates: string[] = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(thisMonday);
      date.setDate(thisMonday.getDate() + i);
      thisWeekDates.push(date.toISOString().split('T')[0]);
    }
    groups.push({ label: 'This week', dates: thisWeekDates });
    
    // Generate dates for next week (Mon-Fri)
    const nextWeekDates: string[] = [];
    const nextMonday = new Date(thisMonday);
    nextMonday.setDate(thisMonday.getDate() + 7);
    for (let i = 0; i < 5; i++) {
      const date = new Date(nextMonday);
      date.setDate(nextMonday.getDate() + i);
      nextWeekDates.push(date.toISOString().split('T')[0]);
    }
    groups.push({ label: 'Next week', dates: nextWeekDates });
    
    setWeekGroups(groups);
    if (thisWeekDates.length > 0) {
      setSelectedDate(thisWeekDates[0]);
    }
  }, []);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (dateString === today.toISOString().split('T')[0]) {
      return t.bookingToday || 'Today';
    }
    if (dateString === tomorrow.toISOString().split('T')[0]) {
      return t.bookingTomorrow || 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
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

