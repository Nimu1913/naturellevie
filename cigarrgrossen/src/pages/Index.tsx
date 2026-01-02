import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ValuePropositions } from "@/components/ValuePropositions";
import { BrandOrigin } from "@/components/BrandOrigin";
import { Logistics } from "@/components/Logistics";
import { Trust } from "@/components/Trust";
import { Footer } from "@/components/Footer";
import { Watermark } from "@/components/Watermark";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Watermark />
      <Header />
      <main>
        <Hero />
        <ValuePropositions />
        <BrandOrigin />
        <Logistics />
        <Trust />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
