import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import heroImage from "@/assets/hero-warehouse.jpg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src={heroImage} 
          alt="Premium cigars" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/70" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2 text-cream/80 hover:text-cream transition-colors w-fit">
            <ArrowLeft size={20} />
            <span className="text-sm">Tillbaka till startsidan</span>
          </Link>
          <div>
            <img src={logo} alt="Cigarrgrossen" className="h-10 brightness-0 invert mb-6" />
            <p className="text-cream/70 text-lg max-w-md leading-relaxed">
              Välkommen till återförsäljarportalen. Logga in för att se priser, 
              lagerstatusar och lägga beställningar.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden bg-charcoal p-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-cream/80 hover:text-cream transition-colors">
              <ArrowLeft size={20} />
              <span className="text-sm">Tillbaka</span>
            </Link>
            <img src={logo} alt="Cigarrgrossen" className="h-6 brightness-0 invert" />
          </div>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-8 bg-cream">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-charcoal mb-3">Logga in</h1>
              <p className="text-charcoal/60">
                Ange dina uppgifter för att komma åt återförsäljarportalen.
              </p>
            </div>

            {/* Form */}
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
                  className="w-full px-4 py-4 border border-border bg-white text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-brown-warm transition-colors"
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
                    className="w-full px-4 py-4 border border-border bg-white text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-brown-warm transition-colors pr-12"
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
                className="w-full bg-brown-warm text-cream py-4 font-semibold tracking-wide text-sm hover:bg-brown-light transition-colors rounded-full"
              >
                Logga in
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-10">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-charcoal/40">eller</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Register CTA */}
            <div className="text-center">
              <p className="text-charcoal/60 mb-4">
                Ännu inte återförsäljare?
              </p>
              <Link 
                to="/#kontakt"
                className="inline-block border-2 border-brown-warm text-brown-warm px-8 py-4 font-semibold tracking-wide text-xs hover:bg-brown-warm hover:text-cream transition-colors rounded-full"
              >
                Ansök om konto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

