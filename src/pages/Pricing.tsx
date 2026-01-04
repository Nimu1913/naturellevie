import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import logoSmall from '../assets/logo-small.png';

export const Pricing = () => {
  const { t } = useLanguage();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const baselineIncludes = [
    t.baselineInclude1,
    t.baselineInclude2,
    t.baselineInclude3,
    t.baselineInclude4
  ];

  // Calculate prices based on billing period
  const getPriceDisplay = (monthlyPrice: string, isYearly: boolean) => {
    if (!isYearly) {
      return {
        original: null,
        discounted: monthlyPrice
      };
    }
    
    // Extract numbers from price strings
    const isSwedish = monthlyPrice.includes('SEK');
    let monthlyValue: number;
    
    if (isSwedish) {
      // Handle Swedish format: "Fr 18k SEK / mån"
      const kMatch = monthlyPrice.match(/(\d+)k/);
      if (kMatch) {
        monthlyValue = parseInt(kMatch[1]) * 1000;
      } else {
        const numberMatch = monthlyPrice.match(/(\d+)/);
        monthlyValue = numberMatch ? parseInt(numberMatch[1]) : 0;
      }
    } else {
      // Handle English format: "From €1,500 / month"
      const numberMatch = monthlyPrice.match(/[\d,]+/);
      if (!numberMatch) return { original: null, discounted: monthlyPrice };
      const numberStr = numberMatch[0].replace(/,/g, '');
      monthlyValue = parseInt(numberStr);
    }
    
    // Yearly price = 10 months (2 months off), so monthly equivalent = yearly / 12
    const yearlyTotal = monthlyValue * 10;
    const discountedMonthlyValue = Math.round((yearlyTotal / 12) / 10) * 10; // Round to nearest 10
    
    if (isSwedish) {
      // Format Swedish prices
      const originalFormatted = monthlyPrice.replace('Fr ', '').replace(' / mån', '');
      let discountedFormatted: string;
      if (discountedMonthlyValue >= 1000) {
        const valueInK = Math.round(discountedMonthlyValue / 1000);
        discountedFormatted = `${valueInK}k SEK / mån`;
      } else {
        discountedFormatted = `${Math.round(discountedMonthlyValue)} SEK / mån`;
      }
      return {
        original: originalFormatted,
        discounted: `Fr ${discountedFormatted}`
      };
    } else {
      // Format English prices
      const originalFormatted = monthlyPrice.replace('From ', '').replace(' / month', '');
      const formattedValue = Math.round(discountedMonthlyValue).toLocaleString();
      return {
        original: originalFormatted,
        discounted: `From €${formattedValue} / month`
      };
    }
  };

  const tiers = [
    {
      name: t.tier1Name,
      subtitle: t.tier1Subtitle,
      positioning: t.tier1Positioning,
      priceDisplay: getPriceDisplay(t.tier1Price, billingPeriod === 'yearly'),
      monthlyPrice: t.tier1Price,
      youHandle: t.tier1YouHandle,
      weHandle: t.tier1WeHandle,
      capabilities: {
        channels: 1,
        funnelDepth: 1,
        strategyInput: 1,
        ownership: "Low"
      },
      adds: [
        t.tier1Add1,
        t.tier1Add2,
        t.tier1Add3,
        t.tier1Add4
      ],
      addOns: null,
      cta: t.tier1Cta,
      isGated: false,
      qualification: t.tier1Qualification,
      notFitIf: t.tier1NotFitIf,
    },
    {
      name: t.tier2Name,
      subtitle: t.tier2Subtitle,
      positioning: t.tier2Positioning,
      priceDisplay: getPriceDisplay(t.tier2Price, billingPeriod === 'yearly'),
      monthlyPrice: t.tier2Price,
      youHandle: t.tier2YouHandle,
      weHandle: t.tier2WeHandle,
      capabilities: {
        channels: 2,
        funnelDepth: 2,
        strategyInput: 2,
        ownership: "Medium"
      },
      adds: [
        t.tier2Add1,
        t.tier2Add2,
        t.tier2Add3,
        t.tier2Add4,
        t.tier2Add5
      ],
      addOns: [t.tier2AddOn1Ecom],
      cta: t.tier2Cta,
      isGated: false,
      qualification: t.tier2Qualification,
      notFitIf: t.tier2NotFitIf,
    },
    {
      name: t.tier3Name,
      subtitle: t.tier3Subtitle,
      positioning: t.tier3Positioning,
      priceDisplay: getPriceDisplay(t.tier3Price, billingPeriod === 'yearly'),
      monthlyPrice: t.tier3Price,
      youHandle: t.tier3YouHandle,
      weHandle: t.tier3WeHandle,
      capabilities: {
        channels: 3,
        funnelDepth: 3,
        strategyInput: 3,
        ownership: "High"
      },
      adds: [
        t.tier3Add1,
        t.tier3Add2,
        t.tier3Add3,
        t.tier3Add4,
        t.tier3Add5
      ],
      addOns: null,
      cta: t.tier3Cta,
      isGated: true,
      qualification: t.tier3Qualification,
      notFitIf: t.tier3NotFitIf,
    },
  ];

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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-steel-100">
              {t.pricingTitle}
            </h1>
            <p className="text-xl text-steel-400 max-w-3xl mx-auto mb-8">
              {t.pricingSubtitle}
            </p>

            {/* Billing Period Toggle */}
            <div className="inline-flex items-center gap-2 p-1 bg-obsidian-800/50 border border-crystal-edge/20 rounded-lg mb-4 relative overflow-visible">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 relative ${
                  billingPeriod === 'monthly'
                    ? 'bg-obsidian-700 text-steel-100'
                    : 'text-steel-400 hover:text-steel-200'
                }`}
              >
                {t.monthly}
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 relative ${
                  billingPeriod === 'yearly'
                    ? 'bg-obsidian-700 text-steel-100'
                    : 'text-steel-400 hover:text-steel-200'
                }`}
              >
                {t.yearly}
              </button>
              <span className="absolute -top-5 -right-10 px-3 py-1 bg-obsidian-900 border-2 border-crystal-blue/60 rounded-full text-[10px] font-bold text-steel-50 z-50 shadow-xl shadow-crystal-blue/30 backdrop-blur-sm whitespace-nowrap">
                {t.twoMonthsOff}
              </span>
            </div>

            {/* Ad Spend Note */}
            <p className="text-xs text-steel-500 mb-8">
              {t.adSpendNote}
            </p>
          </div>

          {/* Baseline Section */}
          <div className="mb-12 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-steel-300 mb-4 uppercase tracking-wider text-center">
              {t.includedInAllPlans}
            </h3>
            <div className="pt-4 border-t border-crystal-edge/10">
              <div className="flex justify-center items-center gap-x-6 gap-y-2 flex-nowrap">
                {baselineIncludes.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-lg text-steel-400 whitespace-nowrap">
                    <span className="text-crystal-blue font-bold text-xl">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tiers */}
          <div className="grid md:grid-cols-3 gap-6 mb-16 relative items-stretch">
            {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative flex flex-col h-full ${
                index === 1 ? 'z-10' : ''
              }`}
            >
                {index === 1 && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-obsidian-900 border-2 border-crystal-blue/60 rounded-full text-xs font-bold text-steel-50 z-50 shadow-xl shadow-crystal-blue/30 backdrop-blur-sm">
                    {t.mostPopular}
                  </div>
                )}
                <div
                  className={`obsidian-card flex flex-col overflow-visible h-full p-6 relative ${
                    index === 1 
                      ? 'bg-obsidian-800/30 border-2 border-crystal-edge/50 shadow-lg shadow-crystal-blue/15' 
                      : ''
                  }`}
                >
                {/* Price Badge - Top Right */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-obsidian-700/40 border border-crystal-edge/25 rounded-md text-steel-300/80" style={{ fontSize: '0.7em', lineHeight: '1.2' }}>
                  {tier.priceDisplay.original ? (
                    <div className="flex items-center gap-1.5">
                      <span className="line-through text-steel-500/60">
                        {tier.priceDisplay.original.replace(' / month', ' / mo').replace(' / mån', ' / mån')}
                      </span>
                      <span className="text-steel-100">
                        {tier.priceDisplay.discounted.replace(' / month', ' / mo').replace(' / mån', ' / mån').replace('From ', '').replace('Fr ', '')}
                      </span>
                    </div>
                  ) : (
                    <span>{tier.priceDisplay.discounted.replace(' / month', ' / mo').replace(' / mån', ' / mån').replace('From ', '').replace('Fr ', '')}</span>
                  )}
                </div>

                {/* Essential Info */}
                <div className="mb-4" style={{ minHeight: '140px' }}>
                  <h1 className="font-display text-3xl font-bold mb-1 text-left text-steel-100 pr-20">
                    {tier.name.includes(' — ') ? tier.name.split(' — ')[1].split(' / ')[0] : tier.name}
                  </h1>
                  <h2 className="font-display text-lg font-medium mb-2 text-left text-steel-400 leading-relaxed">
                    {tier.subtitle}
                  </h2>
                </div>

                {/* Responsibility */}
                <div className="mb-4 pt-2 border-t border-crystal-edge/10">
                  <div className="mb-2">
                    <span className="text-xs text-steel-500 uppercase tracking-wider">Responsibility</span>
                  </div>
                  <div className="mb-2 text-sm">
                    <span className="text-steel-500">You:</span> <span className="text-steel-300">{tier.youHandle}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-steel-500">Us:</span> <span className="text-steel-300">{tier.weHandle}</span>
                  </div>
                </div>

                {/* Scope */}
                <div className="mb-4 pt-2 border-t border-crystal-edge/10">
                  <div className="mb-2">
                    <span className="text-xs text-steel-500 uppercase tracking-wider">{t.scope}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-steel-500">{t.channels}:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((level) => (
                          <span key={level} className={level <= tier.capabilities.channels ? 'text-crystal-blue' : 'text-steel-600'}>
                            {level <= tier.capabilities.channels ? '●' : '○'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-steel-500">{t.funnelDepth}:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((level) => (
                          <span key={level} className={level <= tier.capabilities.funnelDepth ? 'text-crystal-blue' : 'text-steel-600'}>
                            {level <= tier.capabilities.funnelDepth ? '●' : '○'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-steel-500">{t.strategyInput}:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((level) => (
                          <span key={level} className={level <= tier.capabilities.strategyInput ? 'text-crystal-blue' : 'text-steel-600'}>
                            {level <= tier.capabilities.strategyInput ? '●' : '○'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-steel-500">{t.ownership}:</span>
                      <span className="text-steel-300">{tier.capabilities.ownership === "Low" ? t.low : tier.capabilities.ownership === "Medium" ? t.medium : t.high}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="mb-4 space-y-4 pt-4 border-t border-crystal-edge/10">
                    <div className="mb-3">
                      <span className="text-xs text-steel-500 uppercase tracking-wider">{t.whoThisIsFor}</span>
                      <p className="text-steel-400 text-xs mt-1 leading-relaxed">
                        {tier.positioning}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-steel-500 uppercase tracking-wider mb-2 block">{t.includes}</span>
                      <ul className="space-y-2">
                        {tier.adds.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-steel-400">
                            <span className={`mt-0.5 ${index === 1 ? 'text-crystal-blue font-bold' : 'text-crystal-blue font-bold'}`}>
                              ✓
                            </span>
                            <span className={index === 1 ? 'text-steel-300' : 'text-steel-400'}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {tier.addOns && (
                      <div className="pt-2">
                        <p className="text-xs text-steel-500 mb-2 uppercase tracking-wider">
                          {t.optionalAddOns}
                        </p>
                        <ul className="space-y-2">
                          {tier.addOns.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-steel-400">
                              <span className="text-steel-500 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>

                {/* CTA - Pushed to bottom */}
                <div className="mt-auto pt-4" onClick={(e) => e.stopPropagation()}>
                  <Link
                    to={`/booking/${index === 0 ? 'ads-core' : index === 1 ? 'growth-engine' : 'strategic-partner'}`}
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                      tier.isGated
                        ? 'btn-obsidian-outline opacity-90'
                        : 'btn-obsidian opacity-90'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>

                {/* Not a fit if - Footer note */}
                <div className="pt-2 mt-2 border-t border-crystal-edge/5">
                  <p className="text-xs text-steel-600 italic">
                    {t.notFitIf} {tier.notFitIf}.
                  </p>
                </div>
              </div>
            </div>
            ))}
          </div>

          {/* Trust Line */}
          <div className="text-center mb-16">
            <p className="text-steel-400 text-sm max-w-2xl mx-auto">
              {t.notSureLine}
            </p>
          </div>

          {/* Qualification Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl font-bold mb-8 text-center text-steel-100">
              {t.whichPlanTitle}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {tiers.map((tier, index) => {
                const tierDisplayName = tier.name.includes(' — ') ? tier.name.split(' — ')[1].split(' / ')[0] : tier.name;
                return (
                  <div key={index} className="text-center">
                    <div className="text-lg font-semibold text-steel-200 mb-2">
                      {tierDisplayName}
                    </div>
                    <div className="text-steel-400 text-sm">
                      {tier.qualification}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-obsidian-700 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoSmall} alt="Obsidian Peaks" className="h-10 w-auto" />
            <span className="font-display font-medium text-steel-300"></span>
          </div>
          
          <p className="text-steel-600 text-sm font-mono">
            © {new Date().getFullYear()} Obsidian Peaks.
          </p>
        </div>
      </footer>
    </div>
  );
};
