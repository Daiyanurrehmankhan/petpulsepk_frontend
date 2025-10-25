import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react'
import axiosClient from '@/lib/api/axios-client'
import cat1 from "@/assets/cat-1.jpg";
import cat2 from "@/assets/cat-2.jpg";

const Marketplace = () => {
  const navigate = useNavigate();
  
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Button variant="default" size="sm">All Categories</Button>
          <Button variant="outline" size="sm">Cats</Button>
          <Button variant="outline" size="sm">Dogs</Button>
          <Button variant="outline" size="sm">Under $500</Button>
          <Button variant="outline" size="sm">Verified Only</Button>
        </div>

        {/* Pet Listings */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            <p className="text-center w-full">Loading listings...</p>
          ) : listings.length === 0 ? (
            <p className="text-center w-full">No listings yet.</p>
          ) : listings.map((pet) => (
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
                  {pet.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
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