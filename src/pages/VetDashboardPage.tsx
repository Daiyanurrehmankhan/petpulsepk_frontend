import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import VetDashboard from "@/components/VetDashboard";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const VetDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex justify-end">
        <Button className="gap-2" onClick={() => navigate("/vet/appointments")}>
          <Calendar className="w-4 h-4" />
          Manage Appointments
        </Button>
      </div>
      <VetDashboard />
    </div>
  );
};

export default VetDashboardPage;
