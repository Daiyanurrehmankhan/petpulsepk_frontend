import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, Shield, ArrowLeft, CheckCircle, Phone, Mail, Calendar, Ruler } from "lucide-react";
import cat1 from "@/assets/cat-1.jpg";
import cat2 from "@/assets/cat-2.jpg";

// Sample data - same as in Marketplace.tsx
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
    email: 'ahmed.khan@example.com',
    fullDescription: 'This beautiful Golden Retriever puppy is the perfect addition to any family. Born from champion bloodlines, this pup has been raised with love and care. The puppy has received all necessary vaccinations and comes with complete health documentation. Known for their friendly and gentle nature, Golden Retrievers make excellent family pets and are great with children. This particular puppy is very social, loves to play, and is already showing signs of being highly trainable.',
    healthInfo: 'All vaccinations up to date, dewormed, health certificate provided',
    additionalImages: [cat1, cat2]
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
    email: 'fatima.ali@example.com',
    fullDescription: 'This stunning Persian cat is a true beauty with its long, luxurious coat and expressive eyes. Persian cats are known for their calm and gentle demeanor, making them perfect indoor companions. This cat has been well-socialized and is comfortable around people. The cat is fully vaccinated and in excellent health.',
    healthInfo: 'All vaccinations complete, spayed/neutered, health certificate included',
    additionalImages: [cat2, cat1]
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
    email: 'hassan.malik@example.com',
    fullDescription: 'This German Shepherd puppy comes from a reputable breeder and shows excellent temperament. Known for their intelligence and loyalty, German Shepherds are one of the most trainable breeds. This puppy is already showing signs of being quick to learn and eager to please.',
    healthInfo: 'All vaccinations up to date, health certificate provided',
    additionalImages: [cat1, cat2]
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
    email: 'ayesha.rehman@example.com',
    fullDescription: 'This elegant Siamese cat is known for its striking appearance and vocal personality. Siamese cats are highly social and form strong bonds with their owners. This cat is very playful and loves attention.',
    healthInfo: 'All vaccinations complete, health certificate included',
    additionalImages: [cat2, cat1]
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
    email: 'bilal.ahmed@example.com',
    fullDescription: 'This friendly Labrador puppy is perfect for active families. Labradors are known for their friendly nature and love of play. This puppy is very energetic and loves to be around people.',
    healthInfo: 'All vaccinations up to date, health certificate provided',
    additionalImages: [cat1, cat2]
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
    email: 'zainab.hassan@example.com',
    fullDescription: 'This adorable British Shorthair has a distinctive round face and dense, plush coat. Known for their calm and easygoing nature, British Shorthairs make excellent indoor companions.',
    healthInfo: 'All vaccinations complete, health certificate included',
    additionalImages: [cat2, cat1]
  }
];

const PetDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | any>(null);

  useEffect(() => {
    // Find pet from sample data
    const foundPet = sampleListings.find(p => p.id === id);
    if (foundPet) {
      setPet(foundPet);
      setSelectedImage(foundPet.image_url);
    } else {
      // If not found, redirect to marketplace
      navigate('/marketplace');
    }
  }, [id, navigate]);

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
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
            {pet.additionalImages && pet.additionalImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {[pet.image_url, ...pet.additionalImages].map((img, idx) => (
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
                        alt={`${pet.name} ${idx + 1}`}
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
                  <span>{pet.location}</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-6">
                {pet.features.map((feature: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {feature}
                  </Badge>
                ))}
              </div>
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
                      {pet.seller.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{pet.seller}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-muted-foreground">{pet.rating} rating</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{pet.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{pet.email}</span>
                  </div>
                </div>
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




