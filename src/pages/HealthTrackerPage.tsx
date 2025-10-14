import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Calendar, Syringe, Pill, Weight, TrendingUp, Plus } from "lucide-react";
import cat1 from "@/assets/cat-1.jpg";
import cat2 from "@/assets/cat-2.jpg";

const HealthTrackerPage = () => {
  const pets = [
    {
      id: 1,
      name: "Luna",
      type: "Cat",
      breed: "Persian",
      age: "3 years",
      weight: "4.5 kg",
      image: cat1,
      lastCheckup: "2 weeks ago",
      nextVaccination: "March 15, 2025",
      medications: ["Flea Treatment"],
    },
    {
      id: 2,
      name: "Max",
      type: "Cat",
      breed: "British Shorthair",
      age: "2 years",
      weight: "5.2 kg",
      image: cat2,
      lastCheckup: "1 month ago",
      nextVaccination: "April 20, 2025",
      medications: [],
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
              <Heart className="w-4 h-4 mr-2" />
              Health Monitoring
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pet Health <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tracker</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Keep all your pet's health records, vaccination schedules, and medical history in one secure place
            </p>
          </div>

          {/* Pet Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {pets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={pet.image} 
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">{pet.name}</h3>
                    <p className="text-white/90">{pet.breed} • {pet.age}</p>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Weight className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="font-semibold">{pet.weight}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Checkup</p>
                        <p className="font-semibold">{pet.lastCheckup}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vaccination Info */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Syringe className="w-4 h-4 text-secondary" />
                      <span className="font-semibold">Next Vaccination</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{pet.nextVaccination}</p>
                  </div>

                  {/* Medications */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Pill className="w-4 h-4 text-primary" />
                      <span className="font-semibold">Active Medications</span>
                    </div>
                    {pet.medications.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {pet.medications.map((med, index) => (
                          <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            {med}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No active medications</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    <Button variant="hero" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      View Records
                    </Button>
                    <Button variant="outline" className="w-full">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Health Trends
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Add New Pet */}
          <Card className="p-8 text-center border-2 border-dashed">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Add Another Pet</h3>
            <p className="text-muted-foreground mb-4">Start tracking health records for more pets</p>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Add Pet Profile
            </Button>
          </Card>

          {/* Features */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Health Tracking Features</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Vaccination Schedule</h3>
                <p className="text-sm text-muted-foreground">Never miss important vaccinations with automated reminders</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Health Records</h3>
                <p className="text-sm text-muted-foreground">Store all medical records and vet visits securely</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Pill className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Medication Tracking</h3>
                <p className="text-sm text-muted-foreground">Track medications and get reminders for doses</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Growth Monitoring</h3>
                <p className="text-sm text-muted-foreground">Track weight, height, and overall development</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HealthTrackerPage;
