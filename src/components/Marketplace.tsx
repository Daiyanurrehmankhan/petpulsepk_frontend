import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: number;
  gender: string;
  price?: number;
  description?: string;
  medical_history?: string;
  image_urls?: string[]; // older API field for user pets
  image_url?: string; // single image URL from pet record
  images?: string[]; // new listing images array (marketplace)
  pet_name?: string; // when listing joins pet table this may be returned as pet_name
  seller_name?: string; // backend returns seller_name
  city?: string; // seller city
  title?: string;
  full_description?: string;
}

const Marketplace = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("newest")
  
  // Sell pet dialog state
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [additionalDescription, setAdditionalDescription] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [creatingListing, setCreatingListing] = useState(false);
  const [loadingPets, setLoadingPets] = useState(false);

  // listings are fetched from the backend; no hardcoded demo data

  // Fetch listings function
  const fetchListings = async () => {
    try {
      const res = await axiosClient.get('/marketplace/listings')
      const { data } = res
      if (data?.success && Array.isArray(data.data?.listings)) {
        setListings(data.data.listings)
      } else {
        setListings([])
      }
    } catch (err) {
      console.error('Failed to load listings', err)
      setListings([])
    }
  }

  useEffect(() => {
    // // Temporarily using hardcoded data instead of API call
    // setListings(sampleListings)
    // setLoading(false)
    
    // Uncomment below when backend is ready
    
    let mounted = true

    const loadListings = async () => {
      try {
        await fetchListings()
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadListings()
    return () => { mounted = false }
    
  }, [])

  // Fetch user's pets when sell dialog opens
  useEffect(() => {
    if (sellDialogOpen && isAuthenticated) {
      fetchUserPets();
    }
  }, [sellDialogOpen, isAuthenticated]);

  // Update selected pet when pet ID changes (robust string/number handling)
  useEffect(() => {
    if (!sellDialogOpen) {
      // Don't update if dialog is closed
      return;
    }

    // If no selection or no pets loaded, clear selection
    if (!selectedPetId || userPets.length === 0) {
      setSelectedPet(null);
      return;
    }

    const petIdStr = String(selectedPetId);

    // Find by exact string match first (works for UUIDs and numeric strings)
    let pet = userPets.find(p => String(p.id) === petIdStr);

    // If not found, attempt numeric comparison when both sides look numeric
    if (!pet) {
      const selNum = Number(petIdStr);
      if (!Number.isNaN(selNum)) {
        pet = userPets.find(p => {
          const pNum = Number(p.id);
          return !Number.isNaN(pNum) && pNum === selNum;
        });
      }
    }

    if (pet) {
      setSelectedPet(pet);
      if (!listingPrice || listingPrice.trim() === "") {
        setListingPrice(pet.price ? String(pet.price) : "");
      }
    } else {
      setSelectedPet(null);
    }
  }, [selectedPetId, userPets, sellDialogOpen]);

  const fetchUserPets = async () => {
    try {
      setLoadingPets(true);
      const response = await axiosClient.get("/pets");
      if (response.data?.success) {
        setUserPets(response.data.data?.pets || []);
      } else {
        setUserPets([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch pets:", error);
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
    
    const priceNum = Number(listingPrice);
    
    if (!selectedPet) {
      toast({
        title: "Error",
        description: "Please select a pet",
        variant: "destructive",
      });
      return;
    }

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
        description: additionalDescription || selectedPet.medical_history || `${selectedPet.name}${selectedPet.breed ? ` (${selectedPet.breed})` : ""}`,
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
        // Refresh listings to show the newly created listing
        await fetchListings();
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

  const getDisplayName = (item: any) => {
    return item?.name || item?.pet_name || item?.title || "Pet";
  };

  const getDisplayDescription = (item: any) => {
    return item?.description || item?.full_description || item?.medical_history || "No description provided.";
  };

  const getDisplayPrice = (item: any) => {
    const priceValue = typeof item?.price === "number" ? item.price : Number(item?.price || 0);
    if (!Number.isFinite(priceValue) || priceValue <= 0) return "Price not set";
    return `$${priceValue.toLocaleString()}`;
  };

  const getDisplayAge = (item: any) => {
    const ageValue = typeof item?.age === "number" ? item.age : Number(item?.age);
    if (!Number.isFinite(ageValue) || ageValue < 0) return "Age not specified";
    return `${ageValue} ${ageValue === 1 ? "year" : "years"} old`;
  };

  // Prefer listing.images (array) -> image_url (pet) -> image_urls (old) -> fallback
  const getFirstImage = (item: any) => {
    if (!item) return null;
    // Primary source: backend `images` array (marketplace listings)
    if (Array.isArray(item.images) && item.images.length > 0) return getImageUrl(item.images[0]) || item.images[0];
    // Fallback for older user pet records
    if (Array.isArray(item.image_urls) && item.image_urls.length > 0) return getImageUrl(item.image_urls[0]) || item.image_urls[0];
    return null;
  }

  // Helper function to check if text matches search query (matches any word)
  const matchesSearch = (text: string, query: string): boolean => {
    if (!text || !query) return true
    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    // Split query into words and check if any word is found in the text
    const queryWords = lowerQuery.split(/\s+/).filter(word => word.length > 0)
    return queryWords.some(word => lowerText.includes(word))
  }

  // Helper function to determine if pet is a cat
  const isCat = (pet: any): boolean => {
    const name = getDisplayName(pet).toLowerCase()
    const breed = pet.breed?.toLowerCase() || ''
    const combined = `${name} ${breed}`
    
    // Exclude dogs and other animals first
    const isDogBreed = combined.includes('retriever') || combined.includes('shepherd') || 
                       combined.includes('labrador') || combined.includes('puppy')
    
    if (isDogBreed) return false
    
    // Then check for cat breeds
    return combined.includes('cat') || combined.includes('persian') || 
           combined.includes('siamese') || combined.includes('british shorthair') || 
           combined.includes('kitten')
  }

  // Helper function to determine if pet is a dog
  const isDog = (pet: any): boolean => {
    const name = getDisplayName(pet).toLowerCase()
    const breed = pet.breed?.toLowerCase() || ''
    const description = getDisplayDescription(pet).toLowerCase()
    const combined = `${name} ${breed} ${description}`
    return combined.includes('dog') || combined.includes('golden retriever') || 
           combined.includes('german shepherd') || combined.includes('labrador') || 
           combined.includes('puppy') || combined.includes('retriever') ||
           combined.includes('shepherd')
  }

  // Helper function to determine if pet is a parrot
  const isParrot = (pet: any): boolean => {
    const name = getDisplayName(pet).toLowerCase()
    const breed = pet.breed?.toLowerCase() || ''
    const description = getDisplayDescription(pet).toLowerCase()
    const combined = `${name} ${breed} ${description}`
    return combined.includes('parrot') || combined.includes('macaw') || 
           combined.includes('cockatoo') || combined.includes('budgie')
  }

  // Helper function to determine if pet is a rabbit
  const isRabbit = (pet: any): boolean => {
    const name = getDisplayName(pet).toLowerCase()
    const breed = pet.breed?.toLowerCase() || ''
    const description = getDisplayDescription(pet).toLowerCase()
    const combined = `${name} ${breed} ${description}`
    return combined.includes('rabbit') || combined.includes('bunny') || 
           combined.includes('lop')
  }

  // Helper function to extract numeric price from string (e.g., "$500" or "Rs. 500")
  const extractPrice = (priceValue: unknown): number => {
    if (typeof priceValue === 'number') return Number.isFinite(priceValue) ? priceValue : 0
    if (typeof priceValue !== 'string' || !priceValue) return 0
    const numericValue = priceValue.replace(/[^0-9]/g, '')
    return parseInt(numericValue) || 0
  }

  // Filter listings based on active filter and search query
  const filteredListings = useMemo(() => {
    return listings.filter(pet => {
      // Apply search query filter (search in name, breed, and description)
      if (searchQuery) {
        const matchesName = matchesSearch(getDisplayName(pet), searchQuery)
        const matchesBreed = matchesSearch(pet.breed || '', searchQuery)
        const matchesDescription = matchesSearch(getDisplayDescription(pet), searchQuery)
        
        if (!matchesName && !matchesBreed && !matchesDescription) {
          return false
        }
      }

      // Apply category filter
      if (activeFilter === "all") {
        return true
      } else if (activeFilter === "cats") {
        return isCat(pet)
      } else if (activeFilter === "dogs") {
        return isDog(pet)
      } else if (activeFilter === "parrot") {
        return isParrot(pet)
      } else if (activeFilter === "rabbit") {
        return isRabbit(pet)
      } else if (activeFilter === "under500") {
        const price = extractPrice(pet.price)
        return price > 0 && price < 500
      }

      return true
    })
  }, [listings, activeFilter, searchQuery])

  const sortedListings = useMemo(() => {
    const items = [...filteredListings]

    items.sort((a, b) => {
      const priceA = extractPrice(a.price)
      const priceB = extractPrice(b.price)
      const ageA = Number.isFinite(Number(a.age)) ? Number(a.age) : Number.MAX_SAFE_INTEGER
      const ageB = Number.isFinite(Number(b.age)) ? Number(b.age) : Number.MAX_SAFE_INTEGER
      const timeA = a?.created_at ? new Date(a.created_at).getTime() : 0
      const timeB = b?.created_at ? new Date(b.created_at).getTime() : 0
      const nameA = getDisplayName(a).toLowerCase()
      const nameB = getDisplayName(b).toLowerCase()

      if (sortBy === "price-low") return priceA - priceB
      if (sortBy === "price-high") return priceB - priceA
      if (sortBy === "age-young") return ageA - ageB
      if (sortBy === "name-az") return nameA.localeCompare(nameB)
      if (sortBy === "name-za") return nameB.localeCompare(nameA)

      // default newest first
      return timeB - timeA
    })

    return items
  }, [filteredListings, sortBy])

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

        {/* Sort Bar */}
        <div className="max-w-sm mx-auto mb-8">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort listings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="age-young">Age: Youngest First</SelectItem>
              <SelectItem value="name-az">Name: A to Z</SelectItem>
              <SelectItem value="name-za">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
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
          ) : sortedListings.length === 0 ? (
            <p className="text-center w-full">No listings found matching your filters.</p>
          ) : sortedListings.map((pet) => (
            <Card 
              key={pet.id} 
              className="group overflow-hidden hover:shadow-medium transition-all duration-300 border-border/50 bg-card cursor-pointer"
              onClick={() => navigate(`/pet/${pet.id}`)}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                {getFirstImage(pet) ? (
                  <img 
                    src={getFirstImage(pet) || ""}
                    alt={getDisplayName(pet)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">
                    No Image Available
                  </div>
                )}
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
                    <h3 className="text-xl font-semibold text-foreground">{getDisplayName(pet)}</h3>
                    <p className="text-muted-foreground">{pet.breed}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{getDisplayPrice(pet)}</p>
                    <p className="text-sm text-muted-foreground">{getDisplayAge(pet)}</p>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4">{getDisplayDescription(pet)}</p>

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
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {(pet.seller || pet.seller_name || 'Seller').split(' ').map((n:string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{pet.seller || pet.seller_name || 'Seller'}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-muted-foreground">{pet.rating || '-'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-muted-foreground text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {pet.location || pet.city || '-'}
                    </div>
                </div>

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
      <Dialog 
        open={sellDialogOpen} 
        onOpenChange={(open) => {
          setSellDialogOpen(open);
          if (!open) {
            // Reset all state when dialog closes
            setSelectedPetId("");
            setSelectedPet(null);
            setAdditionalDescription("");
            setListingPrice("");
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Pet Listing</DialogTitle>
            <DialogDescription>
              Select a pet from your collection to create a marketplace listing
            </DialogDescription>
          </DialogHeader>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (selectedPet && listingPrice) {
                handleCreateListing();
              }
            }}
            className="space-y-6 py-4"
          >
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
                      navigate("/add-pet");
                    }}
                  >
                    Add Pet
                  </Button>
                </div>
              ) : (
                <Select 
                  value={selectedPetId || undefined} 
                  onValueChange={(value) => {
                    console.log("=== SELECT VALUE CHANGED ===");
                    console.log("Value received:", value, "Type:", typeof value);
                    console.log("Available pets:", userPets.map(p => ({ id: p.id, idType: typeof p.id, name: p.name })));
                    
                    // FIX #1: Ensure value is always a string (pet ID)
                    const petIdStr = String(value);
                    console.log("Setting selectedPetId to:", petIdStr);
                    setSelectedPetId(petIdStr);
                    
                    // Immediately find and set the pet - robust matching
                    const pet = userPets.find(p => {
                      // Try both string and number comparison
                      const strMatch = String(p.id) === petIdStr;
                      const numMatch = Number(p.id) === Number(petIdStr);
                      const match = strMatch || numMatch;
                      console.log(`  Comparing pet.id=${p.id} (${typeof p.id}) with petIdStr="${petIdStr}": strMatch=${strMatch}, numMatch=${numMatch}, final=${match}`);
                      return match;
                    });
                    
                    if (pet) {
                      console.log("✓ SUCCESS: Pet found and set:", pet);
                      setSelectedPet(pet);
                      // Only set price if it's empty
                      if (!listingPrice || listingPrice.trim() === "") {
                        setListingPrice(pet.price ? String(pet.price) : "");
                      }
                    } else {
                      console.error("✗ ERROR: Pet NOT found!");
                      console.error("  Searched for:", petIdStr);
                      console.error("  Available IDs:", userPets.map(p => p.id));
                      setSelectedPet(null);
                    }
                  }}
                >
                  <SelectTrigger className="h-auto min-h-[2.5rem]">
                    {selectedPetId && selectedPet ? (
                      <div className="flex items-center gap-2 w-full">
                        {selectedPet.image_urls && selectedPet.image_urls.length > 0 && (
                          <img
                            src={getImageUrl(selectedPet.image_urls[0]) || ""}
                            alt={selectedPet.name}
                            className="w-8 h-8 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <span className="flex-1 text-left">{selectedPet.name} - {selectedPet.breed}</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Choose a pet to sell" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {userPets.map((pet) => (
                      <SelectItem 
                        key={pet.id} 
                        value={String(pet.id)}
                        className="py-2 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 w-full pl-2">
                          {pet.image_urls && pet.image_urls.length > 0 ? (
                            <img
                              src={getImageUrl(pet.image_urls[0]) || ""}
                              alt={pet.name}
                              className="w-10 h-10 rounded object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-muted flex-shrink-0 flex items-center justify-center">
                              <Heart className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{pet.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{pet.breed}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    <p className="font-medium">{selectedPet.breed}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Age</label>
                    <p className="font-medium">{selectedPet.age} {selectedPet.age === 1 ? 'year' : 'years'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Gender</label>
                    <p className="font-medium capitalize">{selectedPet.gender}</p>
                  </div>
                  {selectedPet.description && (
                    <div className="col-span-2">
                      <label className="text-sm text-muted-foreground">Description</label>
                      <p className="font-medium">{selectedPet.description}</p>
                    </div>
                  )}
                  {selectedPet.medical_history && (
                    <div className="col-span-2">
                      <label className="text-sm text-muted-foreground">Medical History</label>
                      <p className="font-medium">{selectedPet.medical_history}</p>
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
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log("Price input changed:", value);
                    setListingPrice(value);
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Current state: selectedPet={selectedPet ? "✓" : "✗"}, price={listingPrice || "empty"}
                </p>
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
          </form>

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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Confirm button clicked", {
                  selectedPet: !!selectedPet,
                  listingPrice,
                  creatingListing
                });
                if (selectedPet && listingPrice) {
                  handleCreateListing(e);
                }
              }}
              disabled={
                creatingListing ||
                !selectedPet || 
                !listingPrice || 
                listingPrice.trim() === "" || 
                isNaN(Number(listingPrice)) || 
                Number(listingPrice) <= 0
              }
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