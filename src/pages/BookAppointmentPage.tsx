import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Calendar, CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/lib/api/axios-client";
import { createAppointment, CreateAppointmentPayload } from "@/lib/api/vetAppointments";

// Shape returned by GET /users/vets
interface Vet {
  id: string;
  full_name: string;
  email: string;
  is_verified: boolean;
  phone: string | null;
  city: string | null;
  vet_specialization: string | null;
  vet_experience_years: number | null;
}

const BookAppointmentPage = () => {
  const { vetId } = useParams<{ vetId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [vet, setVet] = useState<Vet | null>(null);
  const [vetLoading, setVetLoading] = useState(true);

  // Form fields
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [bookingType, setBookingType] = useState<"BOOKED" | "REQUESTED">("BOOKED");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchVet();
  }, [isAuthenticated, vetId]);

  const fetchVet = async () => {
    try {
      setVetLoading(true);
      const res = await axiosClient.get("/users/vets");
      if (res.data?.success) {
        const found = (res.data.data.vets as Vet[]).find((v) => v.id === vetId);
        if (!found) {
          toast({
            title: "Not Found",
            description: "Vet not found.",
            variant: "destructive",
          });
          navigate("/find-vets");
          return;
        }
        setVet(found);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Could not load vet details.",
        variant: "destructive",
      });
    } finally {
      setVetLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vetId) return;

    const payload: CreateAppointmentPayload = {
      vet_id: vetId,
      pet_name: petName.trim(),
      pet_type: petType.trim(),
      booking_type: bookingType,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      notes: notes.trim() || undefined,
    };

    try {
      setSubmitting(true);
      await createAppointment(payload);
      toast({
        title: "Appointment Booked",
        description: `Your appointment with ${vet?.full_name} has been submitted.`,
      });
      navigate("/find-vets");
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description:
          error.response?.data?.error?.message ||
          error.response?.data?.error ||
          "Could not book appointment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (vetLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Back link */}
        <button
          onClick={() => navigate("/find-vets")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Find Vets
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Book Appointment
          </h1>
          {vet && (
            <p className="text-muted-foreground mt-2">
              with{" "}
              <span className="font-semibold text-foreground">{vet.full_name}</span>
              {vet.vet_specialization && ` — ${vet.vet_specialization}`}
              {vet.city && `, ${vet.city}`}
            </p>
          )}
        </div>

        {/* Booking form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Appointment Details
            </CardTitle>
            <CardDescription>
              Fill in your pet's details and choose a date &amp; time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Pet Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pet Name <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. Whiskers"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  required
                />
              </div>

              {/* Pet Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pet Type <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. Cat, Dog, Bird, Rabbit"
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                  required
                />
              </div>

              {/* Booking Type toggle */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Booking Type <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-3">
                  {(["BOOKED", "REQUESTED"] as const).map((bt) => (
                    <button
                      key={bt}
                      type="button"
                      onClick={() => setBookingType(bt)}
                      className={`flex-1 py-2 px-4 rounded-md border text-sm font-medium transition-colors ${
                        bookingType === bt
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:bg-muted"
                      }`}
                    >
                      {bt === "BOOKED" ? "Book a Slot" : "Send a Request"}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {bookingType === "BOOKED"
                    ? "You are booking a confirmed slot directly."
                    : "You are sending a request for the vet to review and approve."}
                </p>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Appointment Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={appointmentDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Appointment Time <span className="text-destructive">*</span>
                </label>
                <Input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Notes <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Describe symptoms or reason for the visit..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/find-vets")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {submitting ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
