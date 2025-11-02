import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
<<<<<<< HEAD
import { Heart, MapPin, Star, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react'
=======
import { Input } from "@/components/ui/input";
import { Heart, MapPin, Star, Clock, Shield, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from 'react'
>>>>>>> 3c977e3 (Dawood work - marketplace search functionality)
import axiosClient from '@/lib/api/axios-client'
import cat1 from "@/assets/cat-1.jpg";
import cat2 from "@/assets/cat-2.jpg";

const Marketplace = () => {
  const navigate = useNavigate();
  
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
<<<<<<< HEAD
=======
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
>>>>>>> 3c977e3 (Dawood work - marketplace search functionality)

  useEffect(() => {
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

<<<<<<< HEAD
=======
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

>>>>>>> 3c977e3 (Dawood work - marketplace search functionality)
  return (
    <section className="py-20 bg-muted/30" id="marketplace">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Verified & Secure
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

<<<<<<< HEAD
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Button variant="default" size="sm">All Categories</Button>
          <Button variant="outline" size="sm">Cats</Button>
          <Button variant="outline" size="sm">Dogs</Button>
          <Button variant="outline" size="sm">Under $500</Button>
          <Button variant="outline" size="sm">Verified Only</Button>
=======
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
>>>>>>> 3c977e3 (Dawood work - marketplace search functionality)
        </div>

        {/* Pet Listings */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            <p className="text-center w-full">Loading listings...</p>
<<<<<<< HEAD
          ) : listings.length === 0 ? (
            <p className="text-center w-full">No listings yet.</p>
          ) : listings.map((pet) => (
=======
          ) : filteredListings.length === 0 ? (
            <p className="text-center w-full">No listings found matching your filters.</p>
          ) : filteredListings.map((pet) => (
>>>>>>> 3c977e3 (Dawood work - marketplace search functionality)
            <Card key={pet.id} className="group overflow-hidden hover:shadow-medium transition-all duration-300 border-border/50 bg-card">
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={pet.image_url ? (import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/,'') || '') + pet.image_url : cat1} 
                  alt={pet.pet_name || pet.name}
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
                    <h3 className="text-xl font-semibold text-foreground">{pet.name}</h3>
                    <p className="text-muted-foreground">{pet.breed}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{pet.price}</p>
                    <p className="text-sm text-muted-foreground">{pet.age}</p>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4">{pet.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
<<<<<<< HEAD
                  {pet.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
=======
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
>>>>>>> 3c977e3 (Dawood work - marketplace search functionality)
                </div>

                {/* Seller Info */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {pet.seller.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{pet.seller}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-muted-foreground">{pet.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    {pet.location}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="hero" className="flex-1">
                    Contact Seller
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
    </section>
  );
};

export default Marketplace;