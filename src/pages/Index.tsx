import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Marketplace from "@/components/Marketplace";
import VetDashboard from "@/components/VetDashboard";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <Marketplace />
      {user?.role === "vet" && <VetDashboard />}
    </div>
  );
};

export default Index;
