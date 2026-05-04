import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/lib/api/axios-client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Edit, Trash2, PawPrint, Loader2, Image as ImageIcon, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const MyPetsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [listingPrice, setListingPrice] = useState("");
  const [additionalDescription, setAdditionalDescription] = useState("");
  const [creatingListing, setCreatingListing] = useState(false);

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

  const handleDeleteClick = (pet: Pet) => {
    setSelectedPet(pet);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (pet: Pet) => {
    setSelectedPet(pet);
    setEditDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPet) return;

    try {
      setDeleting(true);
      const response = await axiosClient.delete(`/pets/${selectedPet.id}`);
      
      if (response.data?.success) {
        toast({
          title: "Success",
          description: "Pet deleted successfully",
        });
        setPets(pets.filter((p) => p.id !== selectedPet.id));
        setDeleteDialogOpen(false);
        setSelectedPet(null);
      } else {
        throw new Error(response.data?.message || "Failed to delete pet");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete pet",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const confirmEdit = () => {
    if (!selectedPet) return;
    setEditDialogOpen(false);
    navigate(`/my-pets/edit/${selectedPet.id}`);
  };

  const handleSellClick = (pet: Pet) => {
    setSelectedPet(pet);
    setSellDialogOpen(true);
    setListingPrice("");
    setAdditionalDescription("");
  };

  const handleCreateListing = async () => {
    if (!selectedPet) return;

    const priceNum = Number(listingPrice);

    if (!listingPrice || listingPrice.trim() === "" || isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreatingListing(true);

      const listingData = {
        pet_id: selectedPet.id,
        price: priceNum,
        title: `${selectedPet.name}${selectedPet.breed ? ` - ${selectedPet.breed}` : ''}`,
        description: additionalDescription || selectedPet.medical_history || "",
        breed: selectedPet.breed || null,
        age: selectedPet.age || null,
        gender: selectedPet.gender || null,
        medical_history: selectedPet.medical_history || null,
      };

      const response = await axiosClient.post("/marketplace/listings", listingData);

      if (response.data?.success) {
        toast({
          title: "Success",
          description: "Pet listing created successfully!",
        });
        setSellDialogOpen(false);
        setSelectedPet(null);
        setListingPrice("");
        setAdditionalDescription("");
      } else {
        throw new Error(response.data?.message || "Failed to create listing");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create listing",
        variant: "destructive",
      });
    } finally {
      setCreatingListing(false);
    }
  };

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    const baseURL = import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, "") || "";
    return baseURL + imageUrl;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              My Pets
            </h1>
            <p className="text-muted-foreground">
              Manage your pets and their information
            </p>
          </div>
          <Button
            onClick={() => navigate("/add-pet")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Pet
          </Button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : pets.length === 0 ? (
          /* Empty State */
          <Card className="p-12 text-center">
            <PawPrint className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No pets added yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by adding your first pet to track their information
            </p>
            <Button onClick={() => navigate("/add-pet")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Pet
            </Button>
          </Card>
        ) : (
          /* Pets Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card
                key={pet.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Pet Image */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {pet.image_urls && pet.image_urls.length > 0 ? (
                    <img
                      src={getImageUrl(pet.image_urls[0]) || ""}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PawPrint className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Pet Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {pet.name}
                      </h3>
                      <p className="text-muted-foreground">{pet.breed}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">
                      {pet.age} {pet.age === 1 ? "year" : "years"} old
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {pet.gender}
                    </Badge>
                  </div>

                  {pet.medical_history && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {pet.medical_history}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => navigate(`/my-pets/gallery/${pet.id}`)}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Picture Gallery
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => handleSellClick(pet)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Sell Pet
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEditClick(pet)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDeleteClick(pet)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Pet</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedPet?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedPet(null);
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Pet"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Confirmation Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pet</DialogTitle>
            <DialogDescription>
              Are you sure you want to edit <strong>{selectedPet?.name}</strong>? You will be redirected to the edit form.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setSelectedPet(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={confirmEdit}>
              Continue to Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sell Pet Dialog */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sell {selectedPet?.name}</DialogTitle>
            <DialogDescription>
              List your pet on the marketplace. Set a price and add any additional information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Pet Details Preview */}
            {selectedPet && (
              <div className="border rounded-lg p-3 bg-muted/30">
                <p className="text-sm font-medium mb-2">Pet Details</p>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Name:</span> {selectedPet.name}</p>
                  <p><span className="font-medium">Breed:</span> {selectedPet.breed}</p>
                  <p><span className="font-medium">Age:</span> {selectedPet.age} {selectedPet.age === 1 ? 'year' : 'years'}</p>
                  <p><span className="font-medium">Gender:</span> {selectedPet.gender}</p>
                </div>
              </div>
            )}

            {/* Price Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Listing Price *</label>
              <Input
                type="number"
                min="0"
                placeholder="Enter price"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
              />
            </div>

            {/* Additional Description */}
            <div>
              <label className="text-sm font-medium mb-2 block">Additional Description (Optional)</label>
              <Textarea
                placeholder="Add any additional information about this pet listing..."
                value={additionalDescription}
                onChange={(e) => setAdditionalDescription(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setSellDialogOpen(false);
                setSelectedPet(null);
                setListingPrice("");
                setAdditionalDescription("");
              }}
              disabled={creatingListing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateListing}
              disabled={
                creatingListing ||
                !selectedPet || 
                !listingPrice || 
                listingPrice.trim() === "" || 
                isNaN(Number(listingPrice)) || 
                Number(listingPrice) <= 0
              }
            >
              {creatingListing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Listing"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPetsPage;
