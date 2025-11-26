import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Mail, MapPin, Star, Shield, MessageSquare, Send, CheckCircle } from "lucide-react";
import cat1 from "@/assets/cat-1.jpg";
import cat2 from "@/assets/cat-2.jpg";

// Sample data - same as in Marketplace.tsx and PetDetailsPage.tsx
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
];

const ContactSellerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const foundPet = sampleListings.find(p => p.id === id);
    if (foundPet) {
      setPet(foundPet);
    } else {
      navigate('/marketplace');
    }
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message to the seller
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(`/pet/${pet.id}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pet Details
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Pet Summary & Seller Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pet Summary */}
            <Card className="p-6">
              <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                <img
                  src={typeof pet.image_url === 'string' ? pet.image_url : pet.image_url || cat1}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{pet.name}</h3>
              <p className="text-muted-foreground mb-2">{pet.breed}</p>
              <p className="text-2xl font-bold text-primary mb-4">{pet.price}</p>
              {pet.verified && (
                <Badge className="bg-accent text-accent-foreground">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified Listing
                </Badge>
              )}
            </Card>

            {/* Seller Information */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Seller Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {pet.seller.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{pet.seller}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-muted-foreground">{pet.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t">
                  <a
                    href={`tel:${pet.contact}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{pet.contact}</p>
                    </div>
                  </a>
                  
                  <a
                    href={`mailto:${pet.email}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{pet.email}</p>
                    </div>
                  </a>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{pet.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Contact Seller</h2>
                  <p className="text-muted-foreground">Send a message to {pet.seller} about {pet.name}</p>
                </div>
              </div>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Your message has been sent to {pet.seller}. They will get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Your Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Your Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Your Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={`Hi ${pet.seller}, I'm interested in ${pet.name}. Could you please provide more information about...`}
                      rows={8}
                      className="resize-none"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Be specific about what you'd like to know. This helps the seller respond better.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="flex-1 sm:flex-none sm:px-12 text-lg font-bold"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => window.open(`tel:${pet.contact}`, '_self')}
                      className="flex-1 sm:flex-none sm:px-8"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Call Directly
                    </Button>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mt-6">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> This is a buy and sell platform. After sending your message, 
                      the seller will contact you directly to discuss the purchase details, payment, and delivery arrangements.
                    </p>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSellerPage;




