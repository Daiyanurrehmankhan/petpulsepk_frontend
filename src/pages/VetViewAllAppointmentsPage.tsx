import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getMyAppointments,
  VetAppointment,
} from "@/lib/api/vetAppointments";
import { getPetById } from "@/lib/api/pets";

// Badge variant mapping for each status
const statusVariant: Record<
  VetAppointment["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
  COMPLETED: "outline",
};

type StatusFilter = "ALL" | "COMPLETED" | "APPROVED" | "REJECTED";

const statusIcons: Record<StatusFilter, React.ReactNode> = {
  ALL: <Calendar className="w-4 h-4" />,
  COMPLETED: <CheckCircle className="w-4 h-4" />,
  APPROVED: <Clock className="w-4 h-4" />,
  REJECTED: <XCircle className="w-4 h-4" />,
};

const formatAppointmentDate = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatAppointmentTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":");
  const parsedHours = Number(hours);
  if (Number.isNaN(parsedHours)) return timeString;

  const period = parsedHours >= 12 ? "PM" : "AM";
  const displayHours = parsedHours % 12 === 0 ? 12 : parsedHours % 12;
  return `${displayHours}:${minutes} ${period}`;
};

const statusLabels: Record<StatusFilter, string> = {
  ALL: "All Appointments",
  COMPLETED: "Completed",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const VetViewAllAppointmentsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [appointments, setAppointments] = useState<VetAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [petDetails, setPetDetails] = useState<Record<string, any>>({});
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchAppointments();
  }, [isAuthenticated]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getMyAppointments();
      setAppointments(data);
      // Fetch pet details for all appointments with a pet_id
      const petIds = Array.from(new Set(data.map((appt) => appt.pet_id).filter(Boolean)));
      const petDetailsObj: Record<string, any> = {};
      await Promise.all(
        petIds.map(async (petId) => {
          try {
            const pet = await getPetById(petId);
            if (pet) petDetailsObj[petId] = pet;
          } catch {}
        })
      );
      setPetDetails(petDetailsObj);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to load appointments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      if (statusFilter === "ALL") {
        return appt.status === "COMPLETED" || appt.status === "APPROVED" || appt.status === "REJECTED";
      }
      return appt.status === statusFilter;
    });
  }, [appointments, statusFilter]);

  const stats = {
    all: appointments.filter((a) => a.status === "COMPLETED" || a.status === "APPROVED" || a.status === "REJECTED").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    approved: appointments.filter((a) => a.status === "APPROVED").length,
    rejected: appointments.filter((a) => a.status === "REJECTED").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              View All Appointments
            </h1>
            <p className="text-muted-foreground mt-2">
              Review completed, approved, and rejected appointments
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/vet-dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Status Filters */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["ALL", "COMPLETED", "APPROVED", "REJECTED"] as StatusFilter[]).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "hero" : "outline"}
              className="gap-2 justify-center"
              onClick={() => setStatusFilter(status)}
            >
              {statusIcons[status]}
              <span className="hidden sm:inline">{statusLabels[status]}</span>
              <span className="sm:hidden text-xs">{status}</span>
              <Badge variant="secondary" className="ml-auto">
                {status === "ALL"
                  ? stats.all
                  : status === "COMPLETED"
                  ? stats.completed
                  : status === "APPROVED"
                  ? stats.approved
                  : stats.rejected}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No {statusFilter.toLowerCase()} appointments</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You don't have any {statusFilter === "ALL" ? "completed, approved, or rejected" : statusFilter.toLowerCase()} appointments yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appt) => {
              const pet = appt.pet_id ? petDetails[appt.pet_id] : null;
              return (
                <Card
                  key={appt.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <CardTitle className="text-lg">
                          {appt.pet_name}
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({appt.pet_type})
                          </span>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Client: {appt.client_name}
                        </p>
                        {pet && (
                          <div className="mt-2 p-3 rounded bg-muted/40">
                            <div className="font-semibold mb-1">Pet Information</div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div><span className="font-medium">Breed:</span> {pet.breed}</div>
                              <div><span className="font-medium">Age:</span> {pet.age}</div>
                              <div><span className="font-medium">Gender:</span> {pet.gender}</div>
                              {pet.medical_history && (
                                <div><span className="font-medium">Medical History:</span> {pet.medical_history}</div>
                              )}
                              {pet.description && (
                                <div><span className="font-medium">Description:</span> {pet.description}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-medium">
                          {appt.booking_type}
                        </Badge>
                        <Badge variant={statusVariant[appt.status]}>
                          {appt.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {formatAppointmentDate(appt.appointment_date)} at{" "}
                          {formatAppointmentTime(appt.appointment_time.slice(0, 5))}
                        </span>
                      </div>
                      {appt.notes && (
                        <div className="text-muted-foreground sm:col-span-2">
                          <span className="font-medium text-foreground">Notes: </span>
                          {appt.notes}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VetViewAllAppointmentsPage;
