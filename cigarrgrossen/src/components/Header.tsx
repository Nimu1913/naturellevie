import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";

const sortimentItems = [
  { label: "Cigarrer", href: "#sortiment" },
  { label: "Humidorer", href: "#sortiment" },
  { label: "Tändare", href: "#sortiment" },
  { label: "Tillbehör", href: "#sortiment" },
];

const navItems = [
  { label: "Sortiment", href: "#sortiment", hasDropdown: true },
  { label: "Leverans & Lager", href: "#leverans" },
  { label: "För återförsäljare", href: "#aterforsaljare" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortimentDropdownOpen, setSortimentDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSortimentDropdownOpen(false);
      }
    };

    if (sortimentDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortimentDropdownOpen]);

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
              item.hasDropdown ? (
                <div
                  key={item.label}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => setSortimentDropdownOpen(true)}
                  onMouseLeave={() => setSortimentDropdownOpen(false)}
                >
                  <button
                    className="text-sm font-medium tracking-wide text-charcoal-light hover:text-brown-warm transition-colors duration-200 flex items-center gap-1"
                  >
                    {item.label}
                    <ChevronDown size={16} className={`transition-transform duration-200 ${sortimentDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {sortimentDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-cream border border-brown-warm/20 rounded-lg shadow-lg overflow-hidden z-50">
                      {sortimentItems.map((subItem) => (
                        <a
                          key={subItem.label}
                          href={subItem.href}
                          className="block px-4 py-3 text-sm font-medium tracking-wide text-charcoal-light hover:text-brown-warm hover:bg-brown-warm/5 transition-colors duration-200"
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium tracking-wide text-charcoal-light hover:text-brown-warm transition-colors duration-200"
                >
                  {item.label}
                </a>
              )
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

          {/* Mobile CTA */}
          <div className="lg:hidden flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium tracking-wide text-charcoal-light hover:text-brown-warm transition-colors duration-200 py-2 px-4 bg-white border-2 border-brown-warm/20 rounded-full"
            >
              Logga in
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream/90 backdrop-blur-md border-t border-brown-warm/10">
          <nav className="container-premium py-6 space-y-4">
            {navItems.map((item) => (
              item.hasDropdown ? (
                <div key={item.label}>
                  <button
                    onClick={() => setSortimentDropdownOpen(!sortimentDropdownOpen)}
                    className="flex items-center justify-between w-full text-sm font-medium tracking-wide text-charcoal-light hover:text-brown-warm transition-colors duration-200 py-2"
                  >
                    {item.label}
                    <ChevronDown size={16} className={`transition-transform duration-200 ${sortimentDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {sortimentDropdownOpen && (
                    <div className="pl-4 mt-2 space-y-2">
                      {sortimentItems.map((subItem) => (
                        <a
                          key={subItem.label}
                          href={subItem.href}
                          className="block text-sm font-medium tracking-wide text-charcoal-light/80 hover:text-brown-warm transition-colors duration-200 py-2"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setSortimentDropdownOpen(false);
                          }}
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-sm font-medium tracking-wide text-charcoal-light hover:text-brown-warm transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              )
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium tracking-wide text-charcoal-light hover:text-brown-warm transition-colors duration-200 py-3 px-6 bg-white border-2 border-brown-warm/20 rounded-full w-fit"
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
