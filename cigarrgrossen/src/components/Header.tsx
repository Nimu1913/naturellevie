import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Sortiment", href: "#sortiment" },
  { label: "Leverans & Lager", href: "#leverans" },
  { label: "För återförsäljare", href: "#aterforsaljare" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-md border-b border-brown-warm/10">
      <div className="container-premium">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src={logo} alt="Cigarrgrossen" className="h-8 md:h-10" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium tracking-wide text-charcoal-light hover:text-brown-warm transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium tracking-wide text-charcoal-light hover:text-brown-warm transition-colors duration-200"
            >
              Logga in
            </Link>
            <a
              href="#kontakt"
              className="btn-primary text-xs"
            >
              Bli återförsäljare
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-charcoal"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream/90 backdrop-blur-md border-t border-brown-warm/10">
          <nav className="container-premium py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-sm font-medium tracking-wide text-charcoal-light hover:text-brown-warm transition-colors duration-200 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium tracking-wide text-charcoal-light hover:text-brown-warm transition-colors duration-200 py-2"
              >
                Logga in
              </Link>
              <a
                href="#kontakt"
                className="btn-primary text-xs inline-block"
              >
                Bli återförsäljare
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
