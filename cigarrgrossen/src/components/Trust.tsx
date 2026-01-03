import { Building2, ShieldCheck, Handshake, Award } from "lucide-react";

const trustPoints = [
  {
    icon: Building2,
    title: "Etablerat företag",
    description: "Verksamma sedan xxxx med dokumenterad branscherfarenhet.",
  },
  {
    icon: ShieldCheck,
    title: "Endast B2B",
    description: "Fokuserad affärsmodell för professionella återförsäljare.",
  },
  {
    icon: Handshake,
    title: "Personlig kontakt",
    description: "Dedikerad kundansvarig för varje återförsäljarkonto.",
  },
  {
    icon: Award,
    title: "Kvalitetsgaranti",
    description: "Alla produkter hanteras enligt strikta lagringsrutiner.",
  },
];

export const Trust = () => {
  return (
    <section id="aterforsaljare" className="section-padding bg-cream">
      <div className="container-premium">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="heading-section text-charcoal mb-4">
            En partner du kan lita på
          </h2>
          <p className="subheading max-w-2xl mx-auto">
            Cigarrgrossen är en trygg och pålitlig grossist dedikerad till att 
            stödja svenska återförsäljares framgång.
          </p>
        </div>

        {/* Trust Points */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="text-center p-6"
            >
              <div className="w-16 h-16 mx-auto flex items-center justify-center bg-secondary text-brown-warm mb-5 rounded-2xl">
                <point.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">
                {point.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Block */}
        <div className="bg-secondary p-10 lg:p-16 text-center rounded-2xl">
          <h3 className="font-serif text-2xl lg:text-3xl font-semibold text-charcoal mb-4">
            Redo att bli återförsäljare?
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Kontakta oss för att diskutera samarbete och få tillgång till vårt kompletta 
            sortiment med konkurrenskraftiga grossistpriser.
          </p>
          <a
            href="#kontakt"
            className="btn-primary inline-block"
          >
            Kontakta oss idag
          </a>
        </div>
      </div>
    </section>
  );
};
