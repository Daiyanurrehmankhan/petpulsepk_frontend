import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Heart, Users, Shield, Award, Target, Sparkles } from "lucide-react";

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: "Pet-First Approach",
      description: "Every decision we make prioritizes the health and happiness of your beloved pets."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "All veterinarians are verified and certified professionals committed to the highest standards."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Building a supportive community of pet owners and veterinary professionals across Pakistan."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to providing exceptional pet care services through innovation and expertise."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Pet Owners" },
    { number: "500+", label: "Verified Vets" },
    { number: "50+", label: "Cities Covered" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              About PetPulse.pk
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Pakistan's Leading <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Pet Care Platform</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              PetPulse.pk is revolutionizing pet healthcare in Pakistan by connecting pet owners with verified veterinarians, 
              providing AI-powered health diagnostics, and offering a comprehensive marketplace for all pet needs.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Mission */}
          <Card className="p-8 md:p-12 mb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="max-w-3xl mx-auto text-center">
              <Target className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                To make quality veterinary care accessible to every pet owner in Pakistan through technology, 
                connecting communities, and empowering both pet owners and veterinary professionals with the 
                tools they need to ensure the best possible care for our furry friends.
              </p>
            </div>
          </Card>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="p-6 hover:shadow-medium transition-all duration-300">
                  <value.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Story */}
          <Card className="p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2024, PetPulse.pk was born from a simple observation: pet owners in Pakistan 
                  needed better access to reliable veterinary care and pet supplies. What started as a small 
                  initiative has grown into Pakistan's most comprehensive pet care platform.
                </p>
                <p>
                  We've built a network of verified veterinarians across major cities, integrated cutting-edge 
                  AI technology for preliminary health assessments, and created a marketplace that brings 
                  quality pet products directly to your doorstep.
                </p>
                <p>
                  Today, we're proud to serve thousands of pet owners and work with hundreds of veterinary 
                  professionals, all united by a common goal: ensuring every pet receives the care and love 
                  they deserve.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
