import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.png";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-cream shadow-2xl animate-fade-in">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="bg-charcoal px-8 py-10 text-center">
          <img src={logo} alt="Cigarrgrossen" className="h-8 mx-auto mb-4 brightness-0 invert" />
          <p className="text-cream/60 text-sm tracking-wide">
            Återförsäljarportal
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-10">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                E-postadress
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namn@foretag.se"
                className="w-full px-4 py-3 border border-border bg-white text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-brown-warm transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Lösenord
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border bg-white text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-brown-warm transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-brown-warm" />
                <span className="text-charcoal/70">Kom ihåg mig</span>
              </label>
              <a href="#" className="text-brown-warm hover:underline">
                Glömt lösenord?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-charcoal text-cream py-4 font-medium tracking-wider uppercase text-sm hover:bg-charcoal/90 transition-colors"
            >
              Logga in
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-charcoal/40">eller</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Register CTA */}
          <div className="text-center">
            <p className="text-charcoal/60 text-sm mb-3">
              Ännu inte återförsäljare?
            </p>
            <a 
              href="#kontakt" 
              onClick={onClose}
              className="inline-block border border-gold text-gold px-6 py-3 font-medium tracking-wider uppercase text-xs hover:bg-gold hover:text-charcoal transition-colors"
            >
              Ansök om konto
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

