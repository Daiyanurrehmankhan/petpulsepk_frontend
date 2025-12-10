import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, Shield, ArrowLeft, CheckCircle, Phone, Mail, Calendar, Ruler, Images } from "lucide-react";
import axiosClient from '@/lib/api/axios-client'
import cat1 from "@/assets/cat-1.jpg";

const PetDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        console.log('Fetching listing with id:', id);
        const res = await axiosClient.get(`/marketplace/listings/${id}`);
        console.log('Listing response:', res.data);
        if (res.data?.success && res.data?.data?.listing) {
          const listing = res.data.data.listing;
          console.log('Setting pet:', listing);
          setPet(listing);
          // Use first image from images array or image_url or fallback
          const firstImage = Array.isArray(listing.images) && listing.images.length > 0 
            ? listing.images[0] 
            : listing.image_url || cat1;
          setSelectedImage(firstImage);
        } else {
          console.log('Invalid response structure:', res.data);
          navigate('/marketplace');
        }
      } catch (err: any) {
        console.error('Failed to load listing:', err.response?.status, err.message);
        // Navigate back after a delay to ensure error is logged
        setTimeout(() => navigate('/marketplace'), 500);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-2">Loading pet details...</p>
          <p className="text-sm text-muted-foreground">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Pet not found</p>
          <p className="text-sm text-muted-foreground mb-4">ID: {id}</p>
          <Button onClick={() => navigate('/marketplace')}>Back to Marketplace</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/marketplace')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={typeof selectedImage === 'string' ? selectedImage : selectedImage || cat1}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                {pet.verified && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </Card>

            {/* Thumbnail Images */}
            {pet.images && pet.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {pet.images.map((img: string, idx: number) => (
                  <Card
                    key={idx}
                    className={`cursor-pointer overflow-hidden transition-all ${
                      selectedImage === img ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <div className="aspect-square">
                      <img
                        src={typeof img === 'string' ? img : img || cat1}
                        alt={`${pet.pet_name || pet.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">{pet.name}</h1>
                  <p className="text-xl text-muted-foreground">{pet.breed}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-primary">{pet.price}</p>
                </div>
              </div>

              {/* Rating and Location */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{pet.rating}</span>
                  <span className="text-muted-foreground">(12 reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{pet.location || pet.city || '-'}</span>
                </div>
              </div>

              {/* Features */}
              {Array.isArray(pet.features) && pet.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {pet.features.map((feature: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {pet.fullDescription || pet.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Age: </span>
                  <span className="font-medium">{pet.age}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Health: </span>
                  <span className="font-medium">{pet.healthInfo || 'All vaccinations up to date'}</span>
                </div>
              </div>
            </Card>

            {/* Seller Info */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Seller Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-medium">
                      {(pet.seller || pet.seller_name || 'S').split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{pet.seller || pet.seller_name || 'Seller'}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-muted-foreground">{pet.rating || '-'} rating</span>
                    </div>
                  </div>
                </div>
                {(pet.seller_phone || pet.contact || pet.seller_email || pet.email) && (
                  <div className="space-y-2 pt-4 border-t">
                    {(pet.seller_phone || pet.contact) && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{pet.seller_phone || pet.contact}</span>
                      </div>
                    )}
                    {(pet.seller_email || pet.email) && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{pet.seller_email || pet.email}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Fixed BUY Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-2xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-2xl font-bold text-primary">{pet.price}</p>
            </div>
            <Button
              variant="hero"
              size="xl"
              className="flex-1 md:flex-none md:px-12 text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              onClick={() => navigate(`/pet/${pet.id}/contact`)}
            >
              BUY NOW
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden md:flex"
            >
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPage;




