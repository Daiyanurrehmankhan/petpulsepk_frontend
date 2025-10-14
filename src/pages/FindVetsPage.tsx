import Navigation from "@/components/Navigation";
import VetDashboard from "@/components/VetDashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, Clock, MessageCircle, Calendar, Shield, Award } from "lucide-react";
import vetDoctor from "@/assets/vet-doctor.jpg";

const FindVetsPage = () => {
  const vets = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "General Practice",
      rating: 4.9,
      reviews: 245,
      experience: "15 years",
      location: "Islamabad, Pakistan",
      availability: "Available Now",
      image: vetDoctor,
      verified: true,
      languages: ["English", "Urdu"],
      consultationFee: "Rs. 1500",
    },
    {
      id: 2,
      name: "Dr. Ahmed Hassan",
      specialty: "Surgery & Emergency",
      rating: 4.8,
      reviews: 189,
      experience: "12 years",
      location: "Lahore, Pakistan",
      availability: "Available in 30 mins",
      image: vetDoctor,
      verified: true,
      languages: ["English", "Urdu", "Punjabi"],
      consultationFee: "Rs. 2000",
    },
    {
      id: 3,
      name: "Dr. Fatima Khan",
      specialty: "Dermatology",
      rating: 5.0,
      reviews: 312,
      experience: "10 years",
      location: "Karachi, Pakistan",
      availability: "Available Tomorrow",
      image: vetDoctor,
      verified: true,
      languages: ["English", "Urdu"],
      consultationFee: "Rs. 1800",
    },
  ];

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
          <div className="grid gap-6 mb-12">
            {vets.map((vet) => (
              <Card key={vet.id} className="overflow-hidden hover:shadow-medium transition-all duration-300">
                <div className="grid md:grid-cols-4 gap-6 p-6">
                  {/* Vet Image & Basic Info */}
                  <div className="md:col-span-1">
                    <div className="relative">
                      <img 
                        src={vet.image} 
                        alt={vet.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {vet.verified && (
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
                        <h3 className="text-xl font-bold mb-1">{vet.name}</h3>
                        <p className="text-muted-foreground">{vet.specialty}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{vet.rating}</span>
                        <span className="text-muted-foreground text-sm">({vet.reviews})</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-primary" />
                        <span>{vet.experience} experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{vet.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-accent font-medium">{vet.availability}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">Fee: {vet.consultationFee}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {vet.languages.map((lang) => (
                        <span key={lang} className="px-3 py-1 bg-muted rounded-full text-xs">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="md:col-span-1 flex flex-col gap-3">
                    <Button variant="hero" className="w-full">
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
