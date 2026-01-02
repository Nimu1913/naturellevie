import plantationImage from "@/assets/plantation.jpg";
import productImage from "@/assets/product-boxes.jpg";

export const BrandOrigin = () => {
  return (
    <section id="sortiment" className="section-padding bg-cream">
      <div className="container-premium">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="heading-section text-charcoal mb-4">
            Från plantage till butik
          </h2>
          <p className="subheading max-w-2xl mx-auto">
            En resa av hantverksskicklighet och omsorg i varje steg
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden border-4 border-brown-warm/30 shadow-lg">
              <img
                src={plantationImage}
                alt="Tobacco plantation at golden hour"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 md:w-64 z-20 shadow-2xl rounded-xl overflow-hidden border-4 border-brown-warm/40">
              <img
                src={productImage}
                alt="Premium cigar boxes"
                className="w-full aspect-square object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute top-8 -left-4 w-24 h-24 border border-brown-warm/20 rounded-lg -z-10" />
          </div>

          {/* Text Content */}
          <div className="lg:pl-8">
            <div className="space-y-6">
              <p className="text-lg text-charcoal leading-relaxed">
                Cigarrgrossen bygger på ett djupt engagemang för kvalitet och autenticitet. 
                Vi samarbetar direkt med etablerade tillverkare världen över för att säkerställa 
                att varje produkt i vårt sortiment möter de högsta standarderna.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                Från handplockade tobaksblad i karibiska klimat till noggrant lagringsutrymmen 
                i vårt svenska lager – vi följer produkternas väg för att garantera optimal 
                kvalitet och smakprofil när de når era kunder.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Vårt sortiment omfattar ett brett urval av premium-cigarrer från världens 
                mest ansedda regioner: Nicaragua, Dominikanska republiken, Honduras och Kuba. 
                Varje märke väljs med omsorg för att erbjuda återförsäljare ett komplett och 
                konkurrenskraftigt utbud.
              </p>

              {/* Stats or highlights */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border mt-8">
                <div>
                  <p className="text-3xl font-bold text-brown-warm">xx</p>
                  <p className="text-sm text-muted-foreground mt-1">År i branschen</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brown-warm">xx</p>
                  <p className="text-sm text-muted-foreground mt-1">Produkter i lager</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brown-warm">xxh</p>
                  <p className="text-sm text-muted-foreground mt-1">Leveranstid</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
