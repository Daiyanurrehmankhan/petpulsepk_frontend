import axiosClient from './axios-client';

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface VetAppointment {
  id: string;
  client_id: string;
  vet_id: string;
  pet_id: string | null;
  pet_name: string;
  pet_type: string;
  booking_type: 'BOOKED' | 'REQUESTED';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  appointment_date: string;   // "YYYY-MM-DD"
  appointment_time: string;   // "HH:MM:SS"
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields from model query
  client_name?: string;
  client_email?: string;
  vet_name?: string;
  vet_email?: string;
  vet_specialization?: string;
  vet_phone?: string;
}

export interface CreateAppointmentPayload {
  vet_id: string;
  pet_id?: string | null;
  pet_name: string;
  pet_type: string;
  booking_type: 'BOOKED' | 'REQUESTED';
  appointment_date: string;   // "YYYY-MM-DD"
  appointment_time: string;   // "HH:MM"
  notes?: string;
}

export interface UpdateStatusPayload {
  status: 'APPROVED' | 'REJECTED' | 'COMPLETED';
}

// ── API Functions ────────────────────────────────────────────────────────────

export const createAppointment = async (
  payload: CreateAppointmentPayload
): Promise<VetAppointment> => {
  const res = await axiosClient.post('/vet-appointments', payload);
  return res.data.data.appointment as VetAppointment;
};

export const getMyAppointments = async (): Promise<VetAppointment[]> => {
  const res = await axiosClient.get('/vet-appointments');
  return res.data.data.appointments as VetAppointment[];
};

export const updateAppointmentStatus = async (
  id: string,
  payload: UpdateStatusPayload
): Promise<VetAppointment> => {
  const res = await axiosClient.put(`/vet-appointments/${id}/status`, payload);
  return res.data.data.appointment as VetAppointment;
};

export default {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
};
