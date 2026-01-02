import logo from "@/assets/logo.png";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="kontakt" className="bg-charcoal text-cream">
      {/* Main Footer */}
      <div className="container-premium section-padding pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <img src={logo} alt="Cigarrgrossen" className="h-8 mb-6 brightness-0 invert opacity-90" />
            <p className="text-cream/70 leading-relaxed max-w-md mb-6">
              Cigarrgrossen är en svensk tobaksgrossist som levererar 
              premium-cigarrer och tobaksprodukter till återförsäljare i hela Sverige.
            </p>
            <p className="text-sm text-cream/60 uppercase tracking-wider font-medium">
              Endast för registrerade återförsäljare
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-6">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <a href="#sortiment" className="text-cream/70 hover:text-cream transition-colors duration-200">
                  Sortiment
                </a>
              </li>
              <li>
                <a href="#leverans" className="text-cream/70 hover:text-cream transition-colors duration-200">
                  Leverans & Lager
                </a>
              </li>
              <li>
                <a href="#aterforsaljare" className="text-cream/70 hover:text-cream transition-colors duration-200">
                  För återförsäljare
                </a>
              </li>
              <li>
                <a href="#login" className="text-cream/70 hover:text-cream transition-colors duration-200">
                  Logga in
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-semibold mb-6">Kontakt</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-cream/60 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-cream/50 mb-1">E-post</p>
                  <p className="text-cream/90">
                    E-post här
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-cream/60 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-cream/50 mb-1">Telefon</p>
                  <p className="text-cream/90">
                    Telefon här
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-cream/60 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-cream/50 mb-1">Besöksadress</p>
                  <p className="text-cream/90">
                    Adress här
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="container-premium py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-cream/50">
            © 2024 Cigarrgrossen. Alla rättigheter förbehållna.
          </p>
          <div className="flex gap-6 text-sm text-cream/50">
            <a href="#" className="hover:text-cream/80 transition-colors duration-200">
              Integritetspolicy
            </a>
            <a href="#" className="hover:text-cream/80 transition-colors duration-200">
              Villkor
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
