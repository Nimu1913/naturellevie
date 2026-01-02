import aganorsaLeaf from "@/assets/brands/aganorsa-leaf.webp";
import ashton from "@/assets/brands/ashton.webp";
import romeoYJulieta from "@/assets/brands/romeo-y-julieta.webp";
import davidoff from "@/assets/brands/Untitled design (17).png";
import cohiba from "@/assets/brands/Untitled design (18).png";
import partagas from "@/assets/brands/Untitled design (19).png";

const brands = [
  { name: "Aganorsa Leaf", logo: aganorsaLeaf },
  { name: "Ashton", logo: ashton },
  { name: "Romeo y Julieta", logo: romeoYJulieta },
  { name: "Cohiba", logo: cohiba },
  { name: "Partagás", logo: partagas },
  { name: "Davidoff", logo: davidoff },
];

export const BrandMarquee = () => {
  const BrandItem = ({ brand }: { brand: typeof brands[0] }) => (
    <div className="flex-shrink-0 px-8 md:px-12 flex items-center justify-center h-16">
      <img
        src={brand.logo}
        alt={brand.name}
        className="h-6 md:h-8 w-auto max-w-[80px] md:max-w-[120px] object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
      />
    </div>
  );

  return (
    <div className="w-full overflow-hidden py-4">
      <div className="flex animate-marquee" style={{ width: 'max-content' }}>
        {/* First set */}
        {brands.map((brand, index) => (
          <BrandItem key={`a-${index}`} brand={brand} />
        ))}
        {/* Second set for seamless loop */}
        {brands.map((brand, index) => (
          <BrandItem key={`b-${index}`} brand={brand} />
        ))}
        {/* Third set for extra coverage on wide screens */}
        {brands.map((brand, index) => (
          <BrandItem key={`c-${index}`} brand={brand} />
        ))}
        {/* Fourth set - ensures seamless loop */}
        {brands.map((brand, index) => (
          <BrandItem key={`d-${index}`} brand={brand} />
        ))}
      </div>
    </div>
  );
};
