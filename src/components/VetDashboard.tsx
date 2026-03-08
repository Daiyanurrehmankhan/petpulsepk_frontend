import { useState, useEffect } from "react";
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
  Video,
  Loader2,
} from "lucide-react";
import vetDoctor from "@/assets/vet-doctor.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { getMyAppointments, VetAppointment } from "@/lib/api/vetAppointments";
import { useToast } from "@/hooks/use-toast";
import { format, isToday } from "date-fns";

const VetDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<VetAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "vet") {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (error: any) {
      console.error("Failed to fetch appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter today's appointments
  const todaysAppointments = appointments.filter((apt) =>
    isToday(new Date(apt.appointment_date))
  );

  // Calculate stats
  const stats = [
    {
      label: "Patients Today",
      value: todaysAppointments.length.toString(),
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Total Appointments",
      value: appointments.length.toString(),
      icon: Calendar,
      color: "text-secondary",
    },
    {
      label: "Pending",
      value: appointments.filter((a) => a.status === "PENDING").length.toString(),
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "Completed",
      value: appointments.filter((a) => a.status === "COMPLETED").length.toString(),
      icon: TrendingUp,
      color: "text-accent",
    },
  ];

  // Upcoming appointments (today and future, sorted by date/time)
  const upcomingAppointments = appointments
    .filter((apt) => apt.status === "APPROVED" || apt.status === "PENDING")
    .sort(
      (a, b) =>
        new Date(a.appointment_date + " " + a.appointment_time).getTime() -
        new Date(b.appointment_date + " " + b.appointment_time).getTime()
    )
    .slice(0, 5); // Show top 5

  // Consultation requests (pending appointments)
  const consultationRequests = appointments
    .filter((apt) => apt.status === "PENDING")
    .slice(0, 3);

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
                  Upcoming Appointments
                </h3>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {appointment.pet_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.client_name || "Unknown Client"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">
                          {format(new Date(appointment.appointment_date), "MMM dd")} at{" "}
                          {appointment.appointment_time.substring(0, 5)}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {appointment.pet_type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming appointments scheduled
                </div>
              )}
            </Card>

            {/* Consultation Requests */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-secondary" />
                  Consultation Requests
                </h3>
                <div className="flex items-center space-x-2">
                  {consultationRequests.length > 0 && (
                    <>
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                      <span className="text-sm text-accent font-medium">
                        {consultationRequests.length} Active
                      </span>
                    </>
                  )}
                </div>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : consultationRequests.length > 0 ? (
                <div className="space-y-4">
                  {consultationRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{request.pet_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.client_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <Badge variant="secondary" className="text-xs">
                            {request.booking_type}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(request.created_at), "MMM dd, h:mm a")}
                          </p>
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
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No pending consultation requests
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <Card className="p-6 bg-gradient-hero border-border/50">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-primary flex items-center justify-center">
                  {user?.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Stethoscope className="w-10 h-10 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {user?.full_name || "Dr. Veterinarian"}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {user?.vet_specialization || "Veterinary Specialist"}
                </p>
                <div className="flex items-center justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(4.9)</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {appointments.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Patients</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary">
                      {user?.vet_experience_years || "0"}
                    </p>
                    <p className="text-xs text-muted-foreground">Years Exp.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="default" className="w-full justify-start" asChild>
                  <a href="/vet/appointments">
                    <Calendar className="w-4 h-4 mr-2" />
                    View All Appointments
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/pet-portal">
                    <Users className="w-4 h-4 mr-2" />
                    View Patients
                  </a>
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

            {/* Platform Info */}
            <Card className="p-6 bg-gradient-accent/10 border-accent/20">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  PetPulse Platform
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with thousands of pet owners and grow your practice.
                </p>
                <Button variant="accent" className="w-full" asChild>
                  <a href="/find-vets">Explore Platform</a>
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