import axiosClient from './axios-client';

export const getPetById = async (petId: string | number) => {
  const res = await axiosClient.get(`/pets/${petId}`);
  return res.data.data?.pet;
};

export default {
  getPetById,
};
