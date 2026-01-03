import logisticsImage from "@/assets/logistics.jpg";
import { Package, Clock, Shield, MapPin } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Säker förpackning",
    description: "Alla produkter förpackas omsorgsfullt för att bevara kvalitet och fukt under transport.",
  },
  {
    icon: Clock,
    title: "Snabb hantering",
    description: "Beställningar före kl. 14 skickas samma dag från vårt centrala lager.",
  },
  {
    icon: Shield,
    title: "Spårbar leverans",
    description: "Full spårbarhet på alla försändelser med notifiering vid leverans.",
  },
  {
    icon: MapPin,
    title: "Täckning över hela Sverige",
    description: "Leverans till alla återförsäljare i Sverige med anpassade fraktvillkor.",
  },
];

export const Logistics = () => {
  return (
    <section id="leverans" className="section-padding bg-charcoal text-cream">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <div className="gold-line mb-6" />
            <h2 className="heading-section mb-6">
              Logistik & Leverans
            </h2>
            <p className="text-cream/70 text-lg leading-relaxed mb-10">
              Vårt lager i Sverige är navet för effektiv distribution. Med optimerade 
              rutiner och pålitliga transportpartners säkerställer vi att era produkter 
              anländer i perfekt skick, varje gång.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-cream/10 text-cream rounded-lg">
                    <feature.icon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{feature.title}</h4>
                    <p className="text-sm text-cream/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden border-4 border-cream/20 shadow-lg">
            <img
              src={logisticsImage}
              alt="Modern warehouse logistics"
              className="w-full aspect-[4/3] object-cover"
            />
            {/* Decorative overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
            
            {/* Floating stat card */}
            <div className="absolute bottom-6 left-6 right-6 bg-charcoal/90 backdrop-blur-sm p-6 border border-cream/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/70 text-sm uppercase tracking-wider mb-1">Orderprocess</p>
                  <p className="text-xl font-semibold">Beställ → Packas → Levereras</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
