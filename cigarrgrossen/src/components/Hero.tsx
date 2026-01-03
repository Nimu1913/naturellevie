import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-warehouse.jpg";
import { BrandMarquee } from "./BrandMarquee";

export const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex flex-col">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Premium cigar warehouse"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center pt-20 pb-8">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center">
            {/* Decorative line */}
            <div className="gold-line mb-8 animate-slide-in-left mx-auto" />

            {/* Headline */}
            <h1 className="heading-display text-cream mb-6 opacity-0 animate-fade-in text-center" style={{ animationDelay: "0.2s" }}>
              Cigarrgrossist för företag med globalt sortiment och pålitlig leverans
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-cream/80 font-light leading-relaxed mb-10 max-w-2xl mx-auto opacity-0 animate-fade-in text-center" style={{ animationDelay: "0.4s" }}>
              Vi levererar cigarrer och tobaksprodukter till handlare i hela Sverige med fokus på tillgänglighet, kvalitet och pålitlig leveranskedja.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in justify-center items-center" style={{ animationDelay: "0.6s" }}>
              <a
                href="#kontakt"
                className="bg-brown-warm text-cream px-8 py-4 font-semibold tracking-wide text-sm transition-all duration-300 hover:bg-brown-light inline-block text-center rounded-full"
              >
                Bli återförsäljare
              </a>
              <Link
                to="/login"
                className="border-2 border-cream/70 text-cream px-8 py-4 font-semibold tracking-wide text-sm transition-all duration-300 hover:bg-cream/10 inline-block text-center rounded-full"
              >
                Logga in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center py-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
        <div className="w-6 h-10 border-2 border-cream/40 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-cream/60 rounded-full mt-2 animate-bounce" />
        </div>
      </div>

      {/* Brand Marquee - Full width at bottom */}
      <div className="relative z-10 w-full border-t border-cream/10 bg-charcoal/30 backdrop-blur-sm">
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: "1s" }}>
          <BrandMarquee />
        </div>
      </div>
    </section>
  );
};
