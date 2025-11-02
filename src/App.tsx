import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute, PublicOnlyRoute } from "@/components/PrivateRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MarketplacePage from "./pages/MarketplacePage";
import AIHealthCheckPage from "./pages/AIHealthCheckPage";
import FindVetsPage from "./pages/FindVetsPage";
import HealthTrackerPage from "./pages/HealthTrackerPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AddPetPage from "./pages/AddPetPage";
import PetPortalPage from "./pages/PetPortalPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route
              path="/ai-health-check"
              element={
                <PrivateRoute>
                  <AIHealthCheckPage />
                </PrivateRoute>
              }
            />
            <Route path="/find-vets" element={<FindVetsPage />} />
            <Route
              path="/health-tracker"
              element={
                <PrivateRoute>
                  <HealthTrackerPage />
                </PrivateRoute>
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <SignupPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/add-pet"
              element={
                <PrivateRoute>
                  <AddPetPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/pet-portal"
              element={
                <PrivateRoute>
                  <PetPortalPage />
                </PrivateRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
