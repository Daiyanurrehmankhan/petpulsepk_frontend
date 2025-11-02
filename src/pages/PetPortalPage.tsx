import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  healthStatus: string;
  image: string;
  price: number;
}

const PetPortalPage = () => {
  // Mock data - user will handle actual data storage
  const [pets] = useState<Pet[]>([
    // This will be populated from user's backend
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Pet Portal
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your pet listings and add new ones
            </p>
          </div>
          <Link to="/add-pet">
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Add New Pet
            </Button>
          </Link>
        </div>

        {pets.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <PawPrint className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No pets added yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Start by adding your first pet to the marketplace. Share your pets with potential adopters!
              </p>
              <Link to="/add-pet">
                <Button size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Add Your First Pet
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{pet.name}</CardTitle>
                      <CardDescription>
                        {pet.breed} • {pet.species}
                      </CardDescription>
                    </div>
                    <Badge variant={
                      pet.healthStatus === "Excellent" ? "default" :
                      pet.healthStatus === "Good" ? "secondary" : "outline"
                    }>
                      {pet.healthStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Age:</span>
                      <span className="font-medium">{pet.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender:</span>
                      <span className="font-medium">{pet.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-semibold text-lg text-primary">PKR {pet.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">Edit</Button>
                    <Button variant="outline" className="flex-1">Remove</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetPortalPage;
