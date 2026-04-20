import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ImpactSection from "@/components/landing/ImpactSection";
import GestoresSection from "@/components/landing/GestoresSection";
import BusinessSection from "@/components/landing/BusinessSection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ImpactSection />
        <GestoresSection />
        <BusinessSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
