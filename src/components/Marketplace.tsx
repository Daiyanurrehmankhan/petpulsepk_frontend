import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Use native <select> for reliable selection events
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, MapPin, Star, Clock, Shield, Search, DollarSign, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from 'react'
import axiosClient from '@/lib/api/axios-client'
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import cat1 from "@/assets/cat-1.jpg";
import cat2 from "@/assets/cat-2.jpg";

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: number;
  gender: string;
  price?: number;
  description?: string;
  medical_history?: string;
  image_urls?: string[];
}

const Marketplace = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  
  // Sell pet dialog state
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [additionalDescription, setAdditionalDescription] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [creatingListing, setCreatingListing] = useState(false);
  const [loadingPets, setLoadingPets] = useState(false);

  // Hardcoded sample data for demo purposes
  const sampleListings = [
    {
      id: '1',
      name: 'Golden Retriever Puppy',
      breed: 'Golden Retriever',
      age: '2 months',
      price: 'Rs. 45,000',
      description: 'Adorable golden retriever puppy, fully vaccinated and healthy. Very playful and friendly. Comes with health certificate and vaccination records.',
      image_url: cat1,
      verified: true,
      seller: 'Ahmed Khan',
      rating: '4.8',
      location: 'Karachi, Pakistan',
      features: ['Vaccinated', 'Health Certificate', 'Playful', 'Friendly'],
      contact: '+92 300 1234567',
      email: 'ahmed.khan@example.com'
    },
    {
      id: '2',
      name: 'Persian Cat',
      breed: 'Persian',
      age: '6 months',
      price: 'Rs. 25,000',
      description: 'Beautiful Persian cat with long silky fur. Very calm and gentle. Perfect for families. All vaccinations up to date.',
      image_url: cat2,
      verified: true,
      seller: 'Fatima Ali',
      rating: '4.9',
      location: 'Lahore, Pakistan',
      features: ['Vaccinated', 'Calm', 'Family Friendly', 'Pure Breed'],
      contact: '+92 321 9876543',
      email: 'fatima.ali@example.com'
    },
    {
      id: '3',
      name: 'German Shepherd',
      breed: 'German Shepherd',
      age: '3 months',
      price: 'Rs. 60,000',
      description: 'Strong and intelligent German Shepherd puppy. Excellent for training. Very loyal and protective. Health certificate included.',
      image_url: cat1,
      verified: true,
      seller: 'Hassan Malik',
      rating: '4.7',
      location: 'Islamabad, Pakistan',
      features: ['Vaccinated', 'Intelligent', 'Loyal', 'Trainable'],
      contact: '+92 333 4567890',
      email: 'hassan.malik@example.com'
    },
    {
      id: '4',
      name: 'Siamese Cat',
      breed: 'Siamese',
      age: '4 months',
      price: 'Rs. 30,000',
      description: 'Elegant Siamese cat with striking blue eyes. Very social and vocal. Perfect companion for cat lovers.',
      image_url: cat2,
      verified: true,
      seller: 'Ayesha Rehman',
      rating: '4.6',
      location: 'Karachi, Pakistan',
      features: ['Vaccinated', 'Social', 'Vocal', 'Elegant'],
      contact: '+92 345 1234567',
      email: 'ayesha.rehman@example.com'
    },
    {
      id: '5',
      name: 'Labrador Puppy',
      breed: 'Labrador',
      age: '2.5 months',
      price: 'Rs. 40,000',
      description: 'Friendly Labrador puppy, great with kids. Very energetic and playful. All vaccinations complete.',
      image_url: cat1,
      verified: true,
      seller: 'Bilal Ahmed',
      rating: '4.8',
      location: 'Lahore, Pakistan',
      features: ['Vaccinated', 'Kid Friendly', 'Energetic', 'Playful'],
      contact: '+92 300 7654321',
      email: 'bilal.ahmed@example.com'
    },
    {
      id: '6',
      name: 'British Shorthair',
      breed: 'British Shorthair',
      age: '5 months',
      price: 'Rs. 35,000',
      description: 'Cute British Shorthair with round face and dense coat. Very calm and independent. Perfect indoor pet.',
      image_url: cat2,
      verified: true,
      seller: 'Zainab Hassan',
      rating: '4.9',
      location: 'Rawalpindi, Pakistan',
      features: ['Vaccinated', 'Calm', 'Independent', 'Indoor Pet'],
      contact: '+92 321 2345678',
      email: 'zainab.hassan@example.com'
    }
  ]

  useEffect(() => {
    // Temporarily using hardcoded data instead of API call
    setListings(sampleListings)
    setLoading(false)
    
    // Uncomment below when backend is ready
    
    let mounted = true
    const fetchListings = async () => {
      try {
        const res = await axiosClient.get('/marketplace/listings')
        if (!mounted) return
        const { data } = res
        if (data?.success && Array.isArray(data.data?.listings)) {
          setListings(data.data.listings)
        } else {
          setListings([])
        }
      } catch (err) {
        console.error('Failed to load listings', err)
        setListings([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchListings()
    return () => { mounted = false }
    
  }, [])

  // Fetch user's pets when sell dialog opens
  useEffect(() => {
    console.log("Sell dialog opened, fetching pets...", { sellDialogOpen, isAuthenticated });
    if (sellDialogOpen && isAuthenticated) {
      fetchUserPets();
    }
  }, [sellDialogOpen, isAuthenticated]);

  // Log whenever pets are loaded
  useEffect(() => {
    console.log("User pets updated:", userPets);
  }, [userPets]);

  // Update selected pet when pet ID changes
  useEffect(() => {
    console.log("Pet selection effect triggered:", { selectedPetId, userPetsCount: userPets.length });
    
    if (!selectedPetId) {
      setSelectedPet(null);
      return;
    }

    if (userPets.length > 0) {
      const petId = Number(selectedPetId);
      const matchedPet = userPets.find(p => p.id === petId);
      console.log("Looking for pet with ID:", petId, "Found:", matchedPet);
      
      if (matchedPet) {
        console.log("Setting selected pet to:", matchedPet);
        setSelectedPet(matchedPet);
      }
    }
  }, [selectedPetId, userPets]);

  const fetchUserPets = async () => {
    try {
      setLoadingPets(true);
      console.log("Fetching user pets from /pets...");
      const response = await axiosClient.get("/pets");
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      
      if (response.data?.success) {
        const petsData = response.data.data?.pets || [];
        console.log("Pets data fetched:", petsData);
        setUserPets(petsData);
      } else {
        console.log("Response not successful:", response.data);
        setUserPets([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch pets:", error);
      console.error("Error response:", error.response?.data);
      toast({
        title: "Error",
        description: "Failed to load your pets",
        variant: "destructive",
      });
      setUserPets([]);
    } finally {
      setLoadingPets(false);
    }
  };

  const handleCreateListing = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("handleCreateListing called", { selectedPet, listingPrice });
    
    if (!selectedPet) {
      toast({
        title: "Error",
        description: "Please select a pet",
        variant: "destructive",
      });
      return;
    }

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
      console.log("Creating listing with data:", { pet_id: selectedPet.id, price: priceNum });
      
      const listingData = {
        pet_id: selectedPet.id,
        price: priceNum,
        title: `${selectedPet.name}${selectedPet.breed ? ` - ${selectedPet.breed}` : ''}`,
        description: additionalDescription || selectedPet.description || "",
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
        setSelectedPetId("");
        setSelectedPet(null);
        setAdditionalDescription("");
        setListingPrice("");
        // Refresh listings
        // You can add fetchListings() here when backend is ready
      } else {
        throw new Error(response.data?.message || "Failed to create listing");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create listing",
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

  // Helper function to check if text matches search query
  const matchesSearch = (text: string, query: string): boolean => {
    if (!text || !query) return true
    return text.toLowerCase().includes(query.toLowerCase())
  }

  // Helper function to extract numeric price from string (e.g., "$500" or "Rs. 500")
  const extractPrice = (priceStr: string): number => {
    if (!priceStr) return 0
    const numericValue = priceStr.replace(/[^0-9]/g, '')
    return parseInt(numericValue) || 0
  }

  // Filter listings based on active filter and search query
  const filteredListings = useMemo(() => {
    return listings.filter(pet => {
      // Apply search query filter (search in name, breed, and description)
      if (searchQuery) {
        const matchesName = matchesSearch(pet.name || '', searchQuery)
        const matchesBreed = matchesSearch(pet.breed || '', searchQuery)
        const matchesDescription = matchesSearch(pet.description || '', searchQuery)
        
        if (!matchesName && !matchesBreed && !matchesDescription) {
          return false
        }
      }

      // Apply category filter
      if (activeFilter === "all") {
        return true
      } else if (activeFilter === "cats") {
        return matchesSearch(pet.name, "cat") || matchesSearch(pet.breed, "cat") || matchesSearch(pet.description, "cat")
      } else if (activeFilter === "dogs") {
        return matchesSearch(pet.name, "dog") || matchesSearch(pet.breed, "dog") || matchesSearch(pet.description, "dog")
      } else if (activeFilter === "parrot") {
        return matchesSearch(pet.name, "parrot") || matchesSearch(pet.breed, "parrot") || matchesSearch(pet.description, "parrot")
      } else if (activeFilter === "rabbit") {
        return matchesSearch(pet.name, "rabbit") || matchesSearch(pet.breed, "rabbit") || matchesSearch(pet.description, "rabbit")
      } else if (activeFilter === "under500") {
        const price = extractPrice(pet.price || '')
        return price < 500
      }

      return true
    })
  }, [listings, activeFilter, searchQuery])

  return (
    <section className="py-20 bg-muted/30" id="marketplace">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Verified & Secure
              </div>
            </div>
            <div className="flex-1 flex justify-end">
              {isAuthenticated && (
                <Button
                  onClick={() => setSellDialogOpen(true)}
                  className="flex items-center gap-2"
                  variant="default"
                >
                  <DollarSign className="w-4 h-4" />
                  Sell Pet
                </Button>
              )}
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Pet Marketplace
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent block">
              Find Your Perfect Companion
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Browse verified pet listings with health certificates, seller ratings, and comprehensive care information. 
            Every pet comes with health guarantees and full documentation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search pets by name, breed, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-6 text-base"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Button 
            variant={activeFilter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("all")}
          >
            All Categories
          </Button>
          <Button 
            variant={activeFilter === "cats" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("cats")}
          >
            Cats
          </Button>
          <Button 
            variant={activeFilter === "dogs" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("dogs")}
          >
            Dogs
          </Button>
          <Button 
            variant={activeFilter === "parrot" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("parrot")}
          >
            Parrot
          </Button>
          <Button 
            variant={activeFilter === "rabbit" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("rabbit")}
          >
            Rabbit
          </Button>
          <Button 
            variant={activeFilter === "under500" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("under500")}
          >
            Under $500
          </Button>
        </div>

        {/* Pet Listings */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            <p className="text-center w-full">Loading listings...</p>
          ) : filteredListings.length === 0 ? (
            <p className="text-center w-full">No listings found matching your filters.</p>
          ) : filteredListings.map((pet) => (
            <Card 
              key={pet.id} 
              className="group overflow-hidden hover:shadow-medium transition-all duration-300 border-border/50 bg-card cursor-pointer"
              onClick={() => navigate(`/pet/${pet.id}`)}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={pet.image_url || cat1}
                  alt={pet.pet_name || pet.name || 'Pet'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {pet.verified && (
                    <Badge className="bg-accent text-accent-foreground">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 bg-background/80 hover:bg-background"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{pet.pet_name || pet.name || 'N/A'}</h3>
                    <p className="text-muted-foreground">{pet.breed || 'Unknown breed'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">Rs. {pet.price || 'Contact'}</p>
                    <p className="text-sm text-muted-foreground">{pet.age ? `${pet.age} years` : 'N/A'}</p>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4">{pet.description || 'No description available'}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(pet.features) && pet.features.length > 0 ? (
                    pet.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      No features listed
                    </Badge>
                  )}
                </div>

                {/* Seller Info */}
                {pet.seller_name && (
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {pet.seller_name?.split(' ').map((n: string) => n[0]).join('') || 'S'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{pet.seller_name}</p>
                        {pet.city && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {pet.city}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="hero" 
                    className="flex-1"
                    onClick={() => navigate(`/pet/${pet.id}`)}
                  >
                    View Details
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* Add More Card */}
          <Card className="group border-2 border-dashed border-border hover:border-primary/50 transition-colors duration-300 bg-muted/20">
            <div className="aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">More Coming Soon</h3>
                <p className="text-muted-foreground text-sm mb-4 px-4">
                  New verified pet listings are added daily
                </p>
                <Button variant="outline" size="sm">
                  Get Notified
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-secondary/10 rounded-2xl p-8 border border-secondary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Want to sell your pet?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join our verified seller community and reach thousands of loving families.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="warm" size="lg" onClick={() => navigate("/add-pet")}>
                Become a Seller
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sell Pet Dialog */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Create Pet Listing</DialogTitle>
            <DialogDescription>
              Select a pet from your collection to create a marketplace listing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Pet Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Select Pet</label>
              {loadingPets ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : userPets.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No pets found. Please add pets to your collection first.</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      setSellDialogOpen(false);
                      navigate("/my-pets/add");
                    }}
                  >
                    Add Pet
                  </Button>
                </div>
              ) : (
                <div>
                  <select
                    value={selectedPetId}
                    onChange={(e) => {
                      const val = e.target.value;
                      console.log("Pet selected (native select):", val);
                      setSelectedPetId(val);
                      // find and set selected pet immediately for preview
                      const pet = userPets.find(p => String(p.id) === val);
                      if (pet) setSelectedPet(pet);
                    }}
                    className="w-full border rounded px-3 py-2 bg-background"
                  >
                    <option value="">Choose a pet to sell</option>
                    {userPets.map((pet) => (
                      <option key={pet.id} value={String(pet.id)}>
                        {pet.name}{pet.breed ? ` - ${pet.breed}` : ''}
                      </option>
                    ))}
                  </select>

                  {selectedPet && (
                    <div className="mt-3 flex items-center gap-3">
                      {selectedPet.image_urls && selectedPet.image_urls.length > 0 ? (
                        <img
                          src={getImageUrl(selectedPet.image_urls[0]) || ""}
                          alt={selectedPet.name}
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex-shrink-0 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{selectedPet.name}</div>
                        <div className="text-xs text-muted-foreground">{selectedPet.breed || 'N/A'}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Pet Details (Read-only) */}
            {selectedPet && (
              <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
                <h3 className="font-semibold text-lg mb-4">Pet Details</h3>
                
                {/* Pet Image */}
                {selectedPet.image_urls && selectedPet.image_urls.length > 0 && (
                  <div className="mb-4">
                    <img
                      src={getImageUrl(selectedPet.image_urls[0]) || ""}
                      alt={selectedPet.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Name</label>
                    <p className="font-medium">{selectedPet.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Breed</label>
                    <p className="font-medium">{selectedPet.breed || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Age</label>
                    <p className="font-medium">{selectedPet.age} {selectedPet.age === 1 ? 'year' : 'years'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Gender</label>
                    <p className="font-medium capitalize">{selectedPet.gender || 'N/A'}</p>
                  </div>
                  {selectedPet.description && (
                    <div className="col-span-2">
                      <label className="text-sm text-muted-foreground">Description</label>
                      <p className="font-medium text-sm">{selectedPet.description}</p>
                    </div>
                  )}
                  {selectedPet.medical_history && (
                    <div className="col-span-2">
                      <label className="text-sm text-muted-foreground">Medical History</label>
                      <p className="font-medium text-sm">{selectedPet.medical_history}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Listing Price */}
            {selectedPet && (
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
            )}

            {/* Additional Description */}
            {selectedPet && (
              <div>
                <label className="text-sm font-medium mb-2 block">Additional Description (Optional)</label>
                <Textarea
                  placeholder="Add any additional information about this pet listing..."
                  value={additionalDescription}
                  onChange={(e) => setAdditionalDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!creatingListing) {
                  setSellDialogOpen(false);
                  setSelectedPetId("");
                  setSelectedPet(null);
                  setAdditionalDescription("");
                  setListingPrice("");
                }
              }}
              disabled={creatingListing}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateListing}
              disabled={creatingListing || !selectedPet || !listingPrice || isNaN(Number(listingPrice)) || Number(listingPrice) <= 0}
              type="button"
              className="min-w-[120px]"
            >
              {creatingListing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Confirm Listing"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Marketplace;