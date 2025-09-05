import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Brain, 
  ShoppingBag, 
  Stethoscope, 
  Activity, 
  Users, 
  MessageCircle, 
  Calendar,
  ArrowRight,
  Zap,
  Shield,
  Heart
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Skin Disease Detection",
      description: "Computer vision model for detecting cat skin diseases with vet-recommended treatments",
      gradient: "gradient-primary",
      details: ["Real-time image analysis", "95% accuracy rate", "Instant treatment suggestions", "Vet-verified protocols"]
    },
    {
      icon: ShoppingBag,
      title: "Pet Marketplace",
      description: "Secure platform to buy and sell cats with verified sellers and health guarantees",
      gradient: "gradient-secondary",
      details: ["Verified sellers only", "Health certificates", "Secure payments", "Delivery tracking"]
    },
    {
      icon: Stethoscope,
      title: "Veterinary Dashboard",
      description: "Dedicated portal for vets with profile management and service offerings",
      gradient: "gradient-accent",
      details: ["Professional profiles", "Service management", "Appointment scheduling", "Patient records"]
    },
    {
      icon: Activity,
      title: "Health Tracking",
      description: "Smart system to monitor pet health, vaccinations, and medical history",
      gradient: "gradient-primary",
      details: ["Vaccination reminders", "Medical history", "Growth tracking", "Health insights"]
    },
    {
      icon: Users,
      title: "Community Forums",
      description: "Connect with pet owners, share experiences, and get trusted advice",
      gradient: "gradient-secondary",
      details: ["Expert Q&A", "Community support", "Experience sharing", "Moderated discussions"]
    },
    {
      icon: MessageCircle,
      title: "Live Consultation",
      description: "Real-time messaging with certified veterinarians for instant care",
      gradient: "gradient-accent",
      details: ["24/7 availability", "Video consultations", "Instant messaging", "Emergency support"]
    },
    {
      icon: Calendar,
      title: "Pet Care Portal",
      description: "Personalized dashboard for managing daily routines and health schedules",
      gradient: "gradient-primary",
      details: ["Daily diary", "Food reminders", "Vaccination cards", "Activity tracking"]
    }
  ];

  return (
    <section className="py-20 bg-background" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Comprehensive Pet Care Platform
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything Your Pet Needs
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
              In One Platform
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From AI-powered health diagnostics to community support, our comprehensive platform 
            ensures your pet gets the best care possible at every stage of their life.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-medium transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="p-6">
                {/* Icon */}
                <div className={`w-14 h-14 bg-${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Feature Details */}
                <ul className="space-y-2 mb-6">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                      {detail}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button variant="ghost" className="group/btn w-full justify-between p-0 h-auto font-medium">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-hero rounded-3xl p-8 md:p-12 border border-border/50">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <Heart className="w-6 h-6 text-secondary" />
                <Stethoscope className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to give your pet the best care?
              </h3>
              <p className="text-muted-foreground mb-8">
                Join thousands of pet owners who trust our platform for their pet's health and happiness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;