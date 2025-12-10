import axiosClient from './axios-client';

export interface Vaccination {
  id: string;
  pet_id: string;
  vaccine_name: string;
  vaccine_type?: string;
  administered_date: string;
  next_due_date?: string;
  vet_name?: string;
  batch_number?: string;
  notes?: string;
  evidence_url?: string | null;
  verified: boolean;
  vet_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const getVaccinations = async (petId: string) => {
  const res = await axiosClient.get(`/health/vaccinations/${petId}`);
  return res.data.data.vaccinations as Vaccination[];
};

export const createVaccination = async (payload: FormData) => {
  const res = await axiosClient.post(`/health/vaccinations`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data.vaccination as Vaccination;
};

export const updateVaccination = async (id: string, payload: FormData) => {
  const res = await axiosClient.put(`/health/vaccinations/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data.vaccination as Vaccination;
};

export const verifyVaccination = async (id: string) => {
  const res = await axiosClient.patch(`/health/vaccinations/${id}/verify`);
  return res.data.data.vaccination as Vaccination;
};

export const unverifyVaccination = async (id: string) => {
  const res = await axiosClient.patch(`/health/vaccinations/${id}/unverify`);
  return res.data.data.vaccination as Vaccination;
};

export const deleteVaccination = async (id: string) => {
  const res = await axiosClient.delete(`/health/vaccinations/${id}`);
  return res.data;
};

export default {
  getVaccinations,
  createVaccination,
  updateVaccination,
  verifyVaccination,
  unverifyVaccination,
  deleteVaccination,
};
