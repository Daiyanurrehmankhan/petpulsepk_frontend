import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Calendar, 
  MessageCircle, 
  Users, 
  Star, 
  Clock,
  TrendingUp,
  Award,
  Phone,
  Video
} from "lucide-react";
import vetDoctor from "@/assets/vet-doctor.jpg";

const VetDashboard = () => {
  const stats = [
    { label: "Patients Today", value: "12", icon: Users, color: "text-primary" },
    { label: "Consultations", value: "8", icon: MessageCircle, color: "text-secondary" },
    { label: "Rating", value: "4.9", icon: Star, color: "text-yellow-500" },
    { label: "Revenue", value: "$2.4k", icon: TrendingUp, color: "text-accent" }
  ];

  const upcomingAppointments = [
    { time: "10:00 AM", pet: "Fluffy", owner: "Alice Johnson", type: "Check-up" },
    { time: "11:30 AM", pet: "Max", owner: "Bob Smith", type: "Vaccination" },
    { time: "2:00 PM", pet: "Luna", owner: "Carol Wilson", type: "Consultation" }
  ];

  const consultationRequests = [
    { pet: "Whiskers", owner: "David Lee", urgency: "High", time: "5 min ago" },
    { pet: "Buddy", owner: "Emma Davis", urgency: "Medium", time: "15 min ago" },
    { pet: "Coco", owner: "Frank Miller", urgency: "Low", time: "1 hour ago" }
  ];

  return (
    <section className="py-20 bg-background" id="vets">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            <Award className="w-4 h-4 mr-2" />
            Professional Veterinary Platform
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Veterinary Dashboard
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent block">
              Manage Your Practice
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive dashboard for veterinarians to manage appointments, consultations, 
            patient records, and grow their practice with advanced tools.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 text-white`} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Upcoming Appointments */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Today's Appointments
                </h3>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{appointment.pet}</p>
                        <p className="text-sm text-muted-foreground">{appointment.owner}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">{appointment.time}</p>
                      <Badge variant="secondary" className="text-xs">{appointment.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Live Consultations */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-secondary" />
                  Consultation Requests
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  <span className="text-sm text-accent font-medium">3 Active</span>
                </div>
              </div>
              <div className="space-y-4">
                {consultationRequests.map((request, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{request.pet}</p>
                        <p className="text-sm text-muted-foreground">{request.owner}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <Badge 
                          variant={request.urgency === "High" ? "destructive" : request.urgency === "Medium" ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {request.urgency}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{request.time}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="default" size="sm">
                          <Video className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <Card className="p-6 bg-gradient-hero border-border/50">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                  <img 
                    src={vetDoctor} 
                    alt="Dr. Sarah Mitchell" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1">Dr. Sarah Mitchell</h3>
                <p className="text-muted-foreground text-sm mb-4">Veterinary Specialist</p>
                <div className="flex items-center justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(4.9)</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">156</p>
                    <p className="text-xs text-muted-foreground">Patients</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary">8</p>
                    <p className="text-xs text-muted-foreground">Years Exp.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="default" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  View Patients
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Consultation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Medical Records
                </Button>
              </div>
            </Card>

            {/* Join Platform CTA */}
            <Card className="p-6 bg-gradient-accent/10 border-accent/20">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Join Our Platform</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with thousands of pet owners and grow your practice.
                </p>
                <Button variant="accent" className="w-full">
                  Register as Vet
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VetDashboard;