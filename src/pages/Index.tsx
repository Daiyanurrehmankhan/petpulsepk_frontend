import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Marketplace from "@/components/Marketplace";
import VetDashboard from "@/components/VetDashboard";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <Marketplace />
      <VetDashboard />
    </div>
  );
};

export default Index;
