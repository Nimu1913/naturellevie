import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { TimeSlotPicker } from '../components/TimeSlotPicker';
import logoSmall from '../assets/logo-small.png';

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  websiteUrl: string;
  monthlyAdSpend: string;
  comments: string;
  howFoundUs: string;
}

export const Booking = () => {
  const { t } = useLanguage();
  const { packageName } = useParams<{ packageName: string }>();

  // Map package names to tier data
  const packageMap: Record<string, { name: string; callAbout: string[] }> = {
    'ads-core': {
      name: t.adsCoreName,
      callAbout: [t.bookingCallAbout1AdsCore, t.bookingCallAbout2AdsCore, t.bookingCallAbout3AdsCore]
    },
    'growth-engine': {
      name: t.growthEngineName,
      callAbout: [t.bookingCallAbout1GrowthEngine, t.bookingCallAbout2GrowthEngine, t.bookingCallAbout3GrowthEngine]
    },
    'strategic-partner': {
      name: t.strategicPartnerName,
      callAbout: [t.bookingCallAbout1StrategicPartner, t.bookingCallAbout2StrategicPartner, t.bookingCallAbout3StrategicPartner]
    }
  };

  const packageData = packageMap[packageName || ''] || packageMap['ads-core'];
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: string; end: string } | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    websiteUrl: '',
    monthlyAdSpend: '',
    comments: '',
    howFoundUs: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLeadFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.companyName) {
      setIsSubmitting(false);
      return;
    }

    // Small delay for smooth transition
    setTimeout(() => {
      setShowScheduler(true);
      setIsSubmitting(false);
    }, 300);
  };

  const handleTimeSelect = (slot: { start: string; end: string }) => {
    setSelectedTimeSlot(slot);
  };

  const normalizeWebsiteUrl = (url: string): string => {
    // Remove any existing protocol or www
    let normalized = url.trim().toLowerCase();
    normalized = normalized.replace(/^https?:\/\//, '');
    normalized = normalized.replace(/^www\./, '');
    
    // Add https:// if not present
    if (normalized && !normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = `https://${normalized}`;
    }
    
    return normalized;
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/calendar/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          companyName: formData.companyName,
          websiteUrl: formData.websiteUrl ? normalizeWebsiteUrl(formData.websiteUrl) : '',
          monthlyAdSpend: formData.monthlyAdSpend,
          comments: formData.comments,
          howFoundUs: formData.howFoundUs,
          name: `${formData.firstName} ${formData.lastName}`,
          timeSlot: selectedTimeSlot,
          packageName: packageData.name, // Use the display name (e.g., "Ads Core", "Growth Engine", "Strategic Partner")
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm booking');
      }

      // Success - could show a success message or redirect
      console.log('Booking confirmed:', data);
    } catch (error) {
      console.error('Booking submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="relative min-h-screen bg-obsidian-950 grid-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 bg-obsidian-950/65 backdrop-blur-md border-b border-crystal-edge/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <img src={logoSmall} alt="Obsidian Peaks" className="h-12 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              to="/#contact"
              className="btn-obsidian-outline text-sm"
            >
              {t.getInTouch}
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-steel-100">
              {packageData.name}
            </h1>
            <p className="text-lg text-steel-400 leading-relaxed">
              {t.bookingSubtitle}
            </p>
          </div>

          {/* Lead Form */}
          <div className={`mb-12 transition-all duration-500 ease-in-out ${showScheduler ? 'opacity-0 h-0 overflow-hidden pointer-events-none' : 'opacity-100'}`}>
            <div className="obsidian-card p-8 max-w-lg mx-auto">
              <h2 className="text-2xl font-semibold text-steel-100 mb-2 text-center">
                {t.bookingFormHeadline || 'A few quick details'}
              </h2>
              <p className="text-sm text-steel-400 mb-8 text-center">
                {t.bookingFormSubtext || 'So we can make the most of your time.'}
              </p>
              <form onSubmit={handleLeadFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-2">
                    {t.bookingFirstName || 'First name'} <span className="text-steel-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-obsidian-800/50 border border-crystal-edge/20 rounded-lg text-steel-100 placeholder-steel-600 focus:outline-none focus:border-crystal-blue/40 transition-colors"
                    placeholder={t.bookingFirstNamePlaceholder || 'John'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-2">
                    {t.bookingLastName || 'Last name'} <span className="text-steel-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-obsidian-800/50 border border-crystal-edge/20 rounded-lg text-steel-100 placeholder-steel-600 focus:outline-none focus:border-crystal-blue/40 transition-colors"
                    placeholder={t.bookingLastNamePlaceholder || 'Doe'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-2">
                    {t.bookingEmail || 'Email'} <span className="text-steel-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-obsidian-800/50 border border-crystal-edge/20 rounded-lg text-steel-100 placeholder-steel-600 focus:outline-none focus:border-crystal-blue/40 transition-colors"
                    placeholder={t.bookingEmailPlaceholder || 'your@email.com'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-2">
                    {t.bookingCompanyName || 'Company name'} <span className="text-steel-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-obsidian-800/50 border border-crystal-edge/20 rounded-lg text-steel-100 placeholder-steel-600 focus:outline-none focus:border-crystal-blue/40 transition-colors"
                    placeholder={t.bookingCompanyNamePlaceholder || 'Acme Inc.'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-2">
                    {t.bookingWebsiteUrl || 'Website URL'}
                  </label>
                  <input
                    type="text"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    pattern="^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$"
                    className="w-full px-4 py-3 bg-obsidian-800/50 border border-crystal-edge/20 rounded-lg text-steel-100 placeholder-steel-600 focus:outline-none focus:border-crystal-blue/40 transition-colors"
                    placeholder={t.bookingWebsiteUrlPlaceholder || 'example.com'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-2">
                    {t.bookingMonthlyAdSpend || 'Monthly ad spend'}
                  </label>
                  <select
                    name="monthlyAdSpend"
                    value={formData.monthlyAdSpend}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-obsidian-800/50 border border-crystal-edge/20 rounded-lg text-steel-100 focus:outline-none focus:border-crystal-blue/40 transition-colors"
                  >
                    <option value="">{t.bookingSelectAdSpend || 'Select range'}</option>
                    <option value="0-5k">€0–€5k</option>
                    <option value="5k-20k">€5k–€20k</option>
                    <option value="20k-50k">€20k–€50k</option>
                    <option value="50k+">€50k+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-2">
                    {t.bookingHowFoundUs || 'How did you find us?'}
                  </label>
                  <input
                    type="text"
                    name="howFoundUs"
                    value={formData.howFoundUs}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-obsidian-800/50 border border-crystal-edge/20 rounded-lg text-steel-100 placeholder-steel-600 focus:outline-none focus:border-crystal-blue/40 transition-colors"
                    placeholder={t.bookingHowFoundUsPlaceholder || 'Google, LinkedIn, referral, etc.'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-2">
                    {t.bookingComments || 'How can we help you?'}
                  </label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-obsidian-800/50 border border-crystal-edge/20 rounded-lg text-steel-100 placeholder-steel-600 focus:outline-none focus:border-crystal-blue/40 transition-colors resize-none"
                    placeholder={t.bookingCommentsPlaceholder || 'What are you looking to achieve or discuss?'}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.firstName || !formData.lastName || !formData.email || !formData.companyName}
                  className="w-full btn-obsidian py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isSubmitting 
                    ? (t.bookingSubmitting || 'Submitting...')
                    : (t.bookingPickTime || 'Pick a time →')
                  }
                </button>
              </form>
            </div>
          </div>

          {/* Time Slot Picker - Shown after form submission */}
          <div className={`mb-12 transition-all duration-500 ease-in-out ${showScheduler ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
            <div className="obsidian-card p-8 max-w-lg mx-auto">
              <h2 className="text-2xl font-semibold text-steel-100 mb-8 text-center">
                {t.bookingSchedulerHeadline || 'Pick a time that works for you'}
              </h2>
              <TimeSlotPicker 
                packageName={packageName || 'ads-core'} 
                onTimeSelect={handleTimeSelect}
              />
            </div>
          </div>

          {/* Booking Confirmation - Shown after time selection */}
          {selectedTimeSlot && (
            <div className="mb-12">
              <div className="obsidian-card p-8 max-w-lg mx-auto">
                <h2 className="text-xl font-semibold text-steel-100 mb-6">
                  {t.bookingConfirmDetails || 'Confirm Your Booking'}
                </h2>
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div>
                    <p className="text-sm text-steel-400 mb-2">
                      {t.bookingSelectedTime || 'Selected Time'}
                    </p>
                    <p className="text-steel-200 font-medium">
                      {new Date(selectedTimeSlot.start).toLocaleString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-obsidian py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting 
                      ? (t.bookingSubmitting || 'Confirming...')
                      : (t.bookingConfirm || 'Confirm Booking')
                    }
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Reassurance Text */}
          <div className="text-center">
            <p className="text-sm text-steel-500 leading-relaxed max-w-lg mx-auto">
              {t.bookingReassurance}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-obsidian-700 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoSmall} alt="Obsidian Peaks" className="h-10 w-auto" />
            <span className="font-display font-medium text-steel-300">Obsidian Peaks</span>
          </div>
          
          <p className="text-steel-600 text-sm font-mono">
            © {new Date().getFullYear()} Obsidian Peaks.
          </p>
        </div>
      </footer>
    </div>
  );
};

