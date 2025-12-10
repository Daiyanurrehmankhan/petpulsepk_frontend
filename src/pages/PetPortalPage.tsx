import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, PawPrint, Loader2, Syringe, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import axiosClient from "@/lib/api/axios-client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: number;
  gender: string;
  image_urls?: string[];
  medical_history?: string;
  created_at?: string;
  updated_at?: string;
}

const PetPortalPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchPets();
  }, [isAuthenticated, navigate]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/pets");
      if (response.data?.success) {
        setPets(response.data.data?.pets || []);
      } else {
        setPets([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch pets:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load pets",
        variant: "destructive",
      });
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    const baseURL = import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, "") || "";
    return baseURL + imageUrl;
  };

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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : pets.length === 0 ? (
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
                <div className="aspect-square relative overflow-hidden bg-muted">
                  {pet.image_urls && pet.image_urls.length > 0 ? (
                    <img
                      src={getImageUrl(pet.image_urls[0]) || ""}
                      alt={pet.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PawPrint className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div>
                    <CardTitle className="text-2xl">{pet.name}</CardTitle>
                    <CardDescription>
                      {pet.breed}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Age:</span>
                      <span className="font-medium">{pet.age} {pet.age === 1 ? "year" : "years"} old</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender:</span>
                      <span className="font-medium capitalize">{pet.gender}</span>
                    </div>
                  </div>
                  {pet.medical_history && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {pet.medical_history}
                    </p>
                  )}
                  <div className="flex gap-2 mt-4 flex-col sm:flex-row">
                    <Link to={`/pet-portal/vaccinations/${pet.id}`} className="flex-1">
                      <Button 
                        className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all"
                      >
                        <Syringe className="w-4 h-4" />
                        Vaccinations
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2"
                      onClick={() => navigate(`/my-pets/gallery/${pet.id}`)}
                    >
                      <ImageIcon className="w-4 h-4" />
                      Gallery
                    </Button>
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
