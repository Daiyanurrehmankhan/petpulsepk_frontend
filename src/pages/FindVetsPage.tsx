import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import VetDashboard from "@/components/VetDashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, MapPin, Star, Clock, MessageCircle, Calendar,
  Shield, Award, Loader2, User,
} from "lucide-react";
import axiosClient from "@/lib/api/axios-client";

interface Vet {
  id: string;
  full_name: string;
  email: string;
  is_verified: boolean;
  phone: string | null;
  city: string | null;
  vet_specialization: string | null;
  vet_experience_years: number | null;
}

const FindVetsPage = () => {
  const navigate = useNavigate();
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/users/vets")
      .then((res) => {
        if (res.data?.success) {
          setVets(res.data.data.vets || []);
        }
      })
      .catch(() => setVets([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Verified Veterinarians
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Find <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Expert Vets</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with certified veterinarians across Pakistan. Get instant consultations, book appointments, or find emergency care.
            </p>
          </div>

          {/* Search & Filters */}
          <Card className="p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search by name, specialty..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Location"
                  className="pl-10"
                />
              </div>
              <Button variant="hero" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="outline" size="sm">All Specialties</Button>
              <Button variant="outline" size="sm">General Practice</Button>
              <Button variant="outline" size="sm">Surgery</Button>
              <Button variant="outline" size="sm">Dermatology</Button>
              <Button variant="outline" size="sm">Emergency Care</Button>
            </div>
          </Card>

          {/* Vet Listings */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : vets.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground mb-12">
              <User className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg">No vets registered yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 mb-12">
              {vets.map((vet) => (
                <Card key={vet.id} className="overflow-hidden hover:shadow-medium transition-all duration-300">
                  <div className="grid md:grid-cols-4 gap-6 p-6">
                    {/* Vet Avatar */}
                    <div className="md:col-span-1">
                      <div className="relative">
                        <div className="w-full h-48 bg-primary/10 rounded-lg flex items-center justify-center">
                          <User className="w-20 h-20 text-primary/40" />
                        </div>
                        {vet.is_verified && (
                          <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs flex items-center">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vet Details */}
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{vet.full_name}</h3>
                          <p className="text-muted-foreground">
                            {vet.vet_specialization || "General Practice"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-sm text-muted-foreground">New</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {vet.vet_experience_years != null && (
                          <div className="flex items-center gap-2 text-sm">
                            <Award className="w-4 h-4 text-primary" />
                            <span>{vet.vet_experience_years} years experience</span>
                          </div>
                        )}
                        {vet.city && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{vet.city}, Pakistan</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-accent" />
                          <span className="text-accent font-medium">
                            {vet.is_verified ? "Verified" : "Pending Verification"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="md:col-span-1 flex flex-col gap-3">
                      <Button
                        variant="hero"
                        className="w-full"
                        onClick={() => navigate(`/book-appointment/${vet.id}`)}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Vet Dashboard Preview */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-2">Are You a Veterinarian?</h2>
            <p className="text-center text-muted-foreground mb-8">Join our platform and start helping pet owners across Pakistan</p>
            <VetDashboard />
          </div>
        </div>
      </section>
    </div>
  );
};

export default FindVetsPage;
