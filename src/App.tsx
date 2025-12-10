import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute, PublicOnlyRoute } from "@/components/PrivateRoute";
import { RoleDashboardRedirect } from "@/components/RoleDashboardRedirect";
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
import VetDashboardPage from "./pages/VetDashboardPage";
import PetDetailsPage from "./pages/PetDetailsPage";
import VaccinationsPage from "./pages/VaccinationsPage";
import ContactSellerPage from "./pages/ContactSellerPage";
import MyPetsPage from "./pages/MyPetsPage";
import AddEditMyPetPage from "./pages/AddEditMyPetPage";

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
            <Route path="/pet/:id" element={<PetDetailsPage />} />
            <Route path="/pet/:id/contact" element={<ContactSellerPage />} />
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
            <Route
              path="/pet-portal/vaccinations/:petId"
              element={
                <PrivateRoute>
                  <VaccinationsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-pets"
              element={
                <PrivateRoute>
                  <MyPetsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-pets/add"
              element={
                <PrivateRoute>
                  <AddEditMyPetPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-pets/edit/:id"
              element={
                <PrivateRoute>
                  <AddEditMyPetPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/vet-dashboard"
              element={
                <PrivateRoute>
                  <VetDashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <RoleDashboardRedirect />
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
