import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getMyAppointments,
  updateAppointmentStatus,
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

const VetAppointmentsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [appointments, setAppointments] = useState<VetAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [petDetails, setPetDetails] = useState<Record<string, any>>({});

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

  const handleStatusChange = async (
    id: string,
    status: "APPROVED" | "REJECTED" | "COMPLETED"
  ) => {
    try {
      setUpdating(id);
      const updated = await updateAppointmentStatus(id, { status });
      // Update locally to avoid a full refetch
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: updated.status } : a))
      );
      toast({
        title: "Status Updated",
        description: `Appointment marked as ${status}.`,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description:
          error.response?.data?.error?.message ||
          error.response?.data?.error ||
          "Could not update status.",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Appointments
            </h1>
            <p className="text-muted-foreground mt-2">
              {user?.role === "vet"
                ? "Manage appointment requests from clients"
                : "View your booked appointments"}
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate(user?.role === "vet" ? "/vet-dashboard" : "/pet-portal")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : appointments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No appointments yet</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {user?.role === "vet"
                  ? "Clients will appear here once they book with you."
                  : "Book an appointment with a vet to see it here."}
              </p>
              {user?.role !== "vet" && (
                <Button
                  className="mt-6 gap-2"
                  onClick={() => navigate("/find-vets")}
                >
                  <Calendar className="w-4 h-4" />
                  Find a Vet
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => {
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
                          {user?.role === "vet"
                            ? `Client: ${appt.client_name}`
                            : `Vet: ${appt.vet_name}`}
                        </p>
                        {pet && (
                          <div className="mt-2 p-3 rounded bg-muted/40">
                            <div className="font-semibold mb-1">Pet Bio & Medical History</div>
                            <div className="text-sm text-muted-foreground">
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
                    <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {appt.appointment_date} at{" "}
                          {appt.appointment_time.slice(0, 5)}
                        </span>
                      </div>
                      {appt.notes && (
                        <div className="text-muted-foreground sm:col-span-2">
                          <span className="font-medium text-foreground">Notes: </span>
                          {appt.notes}
                        </div>
                      )}
                    </div>

                    {/* Action buttons — vets only, non-terminal statuses only */}
                    {user?.role === "vet" &&
                      appt.status !== "REJECTED" &&
                      appt.status !== "COMPLETED" && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {appt.status === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                className="gap-1.5"
                                disabled={updating === appt.id}
                                onClick={() => handleStatusChange(appt.id, "APPROVED")}
                              >
                                {updating === appt.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="gap-1.5"
                                disabled={updating === appt.id}
                                onClick={() => handleStatusChange(appt.id, "REJECTED")}
                              >
                                {updating === appt.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <XCircle className="w-3 h-3" />
                                )}
                                Reject
                              </Button>
                            </>
                          )}
                          {appt.status === "APPROVED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5"
                              disabled={updating === appt.id}
                              onClick={() => handleStatusChange(appt.id, "COMPLETED")}
                            >
                              {updating === appt.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                              Mark Completed
                            </Button>
                          )}
                        </div>
                      )}
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

export default VetAppointmentsPage;
