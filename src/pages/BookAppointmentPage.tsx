import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
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

const normalizeTime = (time: string): string => {
  if (!time) return "";
  return time.slice(0, 5);
};

const extractAvailableSlots = (payload: any): string[] => {
  const data = payload?.data?.data || {};
  const rawSlots = data.available_slots || [];

  if (!Array.isArray(rawSlots)) return [];

  return rawSlots
    .map((slot: any) => {
      if (typeof slot === "string") return normalizeTime(slot);
      if (slot?.time) return normalizeTime(slot.time);
      if (slot?.appointment_time) return normalizeTime(slot.appointment_time);
      if (slot?.start_time) return normalizeTime(slot.start_time);
      if (slot?.slot) return normalizeTime(slot.slot);
      if (slot?.value) return normalizeTime(slot.value);
      return "";
    })
    .filter(Boolean);
};

const BookAppointmentPage = () => {
  const { vetId } = useParams<{ vetId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [vet, setVet] = useState<Vet | null>(null);
  const [vetLoading, setVetLoading] = useState(true);

  // Pet selection
  const [userPets, setUserPets] = useState<any[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [bookingType, setBookingType] = useState<"BOOKED" | "REQUESTED">("BOOKED");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [practiceStartTime, setPracticeStartTime] = useState("");
  const [practiceEndTime, setPracticeEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchVet();
    fetchUserPets();
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

  const fetchUserPets = async () => {
    try {
      const response = await axiosClient.get("/pets");
      if (response.data?.success) {
        setUserPets(response.data.data?.pets || []);
      } else {
        setUserPets([]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load your pets",
        variant: "destructive",
      });
      setUserPets([]);
    }
  };

  // Fetch available slots when vet or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!vetId || !appointmentDate) {
        setAvailableSlots([]);
        setPracticeStartTime("");
        setPracticeEndTime("");
        setAppointmentTime("");
        return;
      }

      try {
        const res = await axiosClient.get("/vet-appointments/available-slots", {
          params: { vet_id: vetId, date: appointmentDate },
        });

        if (!res?.data?.success) {
          setAvailableSlots([]);
          setPracticeStartTime("");
          setPracticeEndTime("");
          setAppointmentTime("");
          return;
        }

        const data = res.data.data || {};
        const slots = extractAvailableSlots(res);
        const safeSlots =
          Array.isArray(slots) && (slots.length > 0 || Number(data.count || 0) === 0)
            ? slots
            : [];

        setAvailableSlots(safeSlots);
        setPracticeStartTime(normalizeTime(data.practice_start_time || ""));
        setPracticeEndTime(normalizeTime(data.practice_end_time || ""));

        if (!safeSlots.includes(appointmentTime)) {
          setAppointmentTime("");
        }
      } catch (error: any) {
        setAvailableSlots([]);
        setPracticeStartTime("");
        setPracticeEndTime("");
        setAppointmentTime("");

        if (error?.response?.data?.message) {
          toast({
            title: "Slots Unavailable",
            description: error.response.data.message,
            variant: "destructive",
          });
        }
      }
    };
    fetchSlots();
  }, [vetId, appointmentDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vetId) return;

    const selectedPet = userPets.find((pet) => String(pet.id) === selectedPetId);
    if (!selectedPet) {
      toast({
        title: "Select a Pet",
        description: "Please select one of your pets to book the appointment.",
        variant: "destructive",
      });
      return;
    }
    if (!appointmentTime) {
      toast({
        title: "Select a Time Slot",
        description: "Please select an available time slot.",
        variant: "destructive",
      });
      return;
    }
    const payload: CreateAppointmentPayload = {
      vet_id: vetId,
      pet_id: String(selectedPet.id),
      pet_name: selectedPet.name,
      pet_type: selectedPet.breed || selectedPet.type || "",
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


              {/* Select Pet */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Pet <span className="text-destructive">*</span>
                </label>
                <Select value={selectedPetId} onValueChange={setSelectedPetId} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={userPets.length === 0 ? "No pets found" : "Choose a pet"} />
                  </SelectTrigger>
                  <SelectContent>
                    {userPets.map((pet) => (
                      <SelectItem key={pet.id} value={String(pet.id)}>
                        {pet.name} {pet.breed ? `(${pet.breed})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {userPets.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    You have no pets. <a href="/my-pets" className="underline">Add a pet first</a>.
                  </p>
                )}
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

              {/* Time Slot Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Appointment Time <span className="text-destructive">*</span>
                </label>
                <Select value={appointmentTime} onValueChange={setAppointmentTime} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={availableSlots.length === 0 ? "No slots available" : "Choose a time slot"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableSlots.length === 0 && appointmentDate && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    No available slots for this date.
                  </p>
                )}
                {practiceStartTime && practiceEndTime && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Vet hours: {practiceStartTime} - {practiceEndTime}
                  </p>
                )}
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
