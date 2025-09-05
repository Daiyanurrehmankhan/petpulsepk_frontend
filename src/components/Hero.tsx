import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Heart, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Happy pets with their owners" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Heart className="w-4 h-4 mr-2" />
              AI-Powered Pet Healthcare Platform
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Complete Pet Care
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                At Your Fingertips
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              From AI-powered health diagnostics to secure pet marketplace, vet consultations, 
              and comprehensive health tracking - everything your pet needs in one platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button variant="hero" size="xl" className="group">
                Explore Marketplace
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="group">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-primary mb-1">
                  <Shield className="w-5 h-5" />
                  <span className="text-2xl font-bold">1000+</span>
                </div>
                <p className="text-sm text-muted-foreground">Verified Vets</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-secondary mb-1">
                  <Heart className="w-5 h-5" />
                  <span className="text-2xl font-bold">5000+</span>
                </div>
                <p className="text-sm text-muted-foreground">Happy Pets</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-accent mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="text-2xl font-bold">24/7</span>
                </div>
                <p className="text-sm text-muted-foreground">Support</p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-border/50 hover:shadow-medium transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Health Diagnostics</h3>
              <p className="text-muted-foreground text-sm">
                Advanced computer vision to detect pet skin diseases with veterinary-grade accuracy.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-border/50 hover:shadow-medium transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Marketplace</h3>
              <p className="text-muted-foreground text-sm">
                Buy and sell pets safely with verified sellers and comprehensive health records.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-border/50 hover:shadow-medium transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Vet Consultation</h3>
              <p className="text-muted-foreground text-sm">
                Connect with certified veterinarians instantly for expert advice and care.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-border/50 hover:shadow-medium transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Health Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Complete health records, vaccination tracking, and personalized care routines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;