import { Truck, Warehouse, Users } from "lucide-react";

const propositions = [
  {
    icon: Truck,
    title: "Snabb och pålitlig leverans",
    description: "Effektiv distribution med fokus på korta ledtider och säker hantering av dina beställningar.",
  },
  {
    icon: Warehouse,
    title: "Lager i Sverige",
    description: "Centralt svenskt lager säkerställer snabb tillgång och enkel orderhantering för hela marknaden.",
  },
  {
    icon: Users,
    title: "Anpassad för återförsäljare",
    description: "Skräddarsydda villkor, konkurrenskraftiga priser och personlig service för professionella handlare.",
  },
];

export const ValuePropositions = () => {
  return (
    <section className="section-padding bg-cream-dark">
      <div className="container-premium">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {propositions.map((prop, index) => (
            <div
              key={prop.title}
              className="group p-8 lg:p-10 bg-card rounded-2xl border-2 border-brown-warm/10 hover:border-brown-warm/30 transition-all duration-500 hover:shadow-lg"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 flex items-center justify-center bg-brown-warm/10 text-brown-warm mb-6 rounded-xl group-hover:bg-brown-warm/20 transition-colors duration-300">
                <prop.icon size={28} strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="text-xl lg:text-2xl font-bold text-charcoal mb-4">
                {prop.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
