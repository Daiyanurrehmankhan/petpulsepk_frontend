import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, MapPin, Star, Clock, MessageCircle, Calendar,
  Shield, Award, Loader2, User, Mail, PhoneCall, Copy, X,
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
  const [query, setQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [contactVet, setContactVet] = useState<Vet | null>(null);
  const [copied, setCopied] = useState<"email" | "phone" | null>(null);

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

  const filteredVets = useMemo(() => {
    const q = query.trim().toLowerCase();
    const loc = locationQuery.trim().toLowerCase();
    return vets.filter((vet) => {
      const inQuery = q === "" || [vet.full_name, vet.vet_specialization, vet.email]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
      const inLoc = loc === "" || (vet.city || "").toLowerCase().includes(loc);
      return inQuery && inLoc;
    });
  }, [vets, query, locationQuery]);

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
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                  />
                </div>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Location"
                  className="pl-10"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
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
              {/** display filtered vets based on query & location */}
              {filteredVets.map((vet) => (
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
                      <Button variant="outline" className="w-full" onClick={() => setContactVet(vet)}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Contact popup (mailto/tel) */}
          {contactVet && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="absolute inset-0 bg-black/40" onClick={() => setContactVet(null)} />
              <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-5 mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary/60" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Contact {contactVet.full_name}</h4>
                      <p className="text-sm text-muted-foreground">Open your phone or email app to contact directly.</p>
                    </div>
                  </div>
                  <button
                    aria-label="Close"
                    className="p-1 rounded-md text-muted-foreground hover:bg-muted/10"
                    onClick={() => setContactVet(null)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">Email</div>
                      <div className="font-medium text-sm break-words">{contactVet.email || "Not provided"}</div>
                      {copied === "email" && <div className="text-xs text-success mt-1">Copied email to clipboard</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      {contactVet.email ? (
                        <a href={`mailto:${contactVet.email}`} className="-ml-1">
                          <button className="inline-flex items-center gap-2 px-3 py-2 bg-sky-400 hover:bg-sky-500 text-white rounded-md">
                            <Mail className="w-4 h-4" />
                            Email
                          </button>
                        </a>
                      ) : null}
                      {contactVet.email ? (
                        <button
                          className="px-3 py-2 border rounded-md text-sm text-muted-foreground"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(contactVet.email || "");
                              setCopied("email");
                              setTimeout(() => setCopied(null), 1800);
                            } catch {}
                          }}
                        >
                          <div className="flex items-center gap-2"><Copy className="w-4 h-4" /> Copy</div>
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">Phone</div>
                      <div className="font-medium text-sm">{contactVet.phone || "Not provided"}</div>
                      {copied === "phone" && <div className="text-xs text-success mt-1">Copied phone to clipboard</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      {contactVet.phone ? (
                        <a href={`tel:${contactVet.phone}`} className="-ml-1">
                          <button className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md">
                            <PhoneCall className="w-4 h-4" />
                            Call
                          </button>
                        </a>
                      ) : null}
                      {contactVet.phone ? (
                        <button
                          className="px-3 py-2 border rounded-md text-sm text-muted-foreground"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(contactVet.phone || "");
                              setCopied("phone");
                              setTimeout(() => setCopied(null), 1800);
                            } catch {}
                          }}
                        >
                          <div className="flex items-center gap-2"><Copy className="w-4 h-4" /> Copy</div>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default FindVetsPage;
