import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageSquare, Clock } from "lucide-react";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "support@petpulse.pk",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+92 300 1234567",
      description: "Mon-Sat from 9am to 6pm"
    },
    {
      icon: MapPin,
      title: "Office",
      content: "Islamabad, Pakistan",
      description: "Visit our headquarters"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon - Sat: 9am - 6pm",
      description: "Sunday: Closed"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4 mr-2" />
              Get In Touch
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Form */}
            <Card className="lg:col-span-2 p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input type="tel" placeholder="+92 300 1234567" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input placeholder="How can we help?" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea 
                    placeholder="Tell us more about your inquiry..." 
                    className="min-h-32"
                  />
                </div>

                <Button variant="hero" size="lg" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <Card key={info.title} className="p-6 hover:shadow-medium transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{info.title}</h3>
                      <p className="text-foreground font-medium mb-1">{info.content}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                </Card>
              ))}

              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                <h3 className="font-bold mb-3">Need Immediate Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For urgent pet health concerns, please use our AI Health Check or contact a vet directly through our platform.
                </p>
                <Button variant="outline" className="w-full">
                  Find a Vet Now
                </Button>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div>
                <h3 className="font-bold mb-2">How quickly will I get a response?</h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Can I schedule a call?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Mention your preferred time in the message and we'll arrange a call.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Do you offer emergency support?</h3>
                <p className="text-sm text-muted-foreground">
                  For pet emergencies, please use our "Find Vets" feature to connect with available veterinarians immediately.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">How can I become a partner vet?</h3>
                <p className="text-sm text-muted-foreground">
                  Send us your credentials via this form, and our team will contact you with partnership details.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
