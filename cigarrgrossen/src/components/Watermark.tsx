import watermarkLogo from "@/assets/watermark.png";

export const Watermark = () => {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Logo with text underneath */}
      <a 
        href="https://obsidianpeaks.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 flex flex-col items-center pointer-events-auto cursor-pointer hover:opacity-70 transition-opacity"
        style={{ mixBlendMode: 'darken' }}
      >
        <img 
          src={watermarkLogo} 
          alt="Obsidian Peaks" 
          className="w-48 md:w-64 opacity-50"
        />
        <div className="mt-2 text-center">
          <p className="text-xs font-semibold tracking-wider uppercase text-charcoal/60">
            Draft Preview
          </p>
          <p className="text-[10px] text-charcoal/40 mt-0.5">
            by Obsidian Peaks
          </p>
        </div>
      </a>
    </div>
  );
};

