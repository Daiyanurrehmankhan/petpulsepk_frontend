import axiosClient from "./axios-client";

export interface RegisterPetResponse {
  success: boolean;
  message: string;
  data: {
    petId: string;
    type: "Dog" | "Cat";
    pythonResponse: {
      status: string;
      type: string;
      message: string;
    };
  };
  error?: string;
}

export interface IdentifyPetResponse {
  success: boolean;
  message: string;
  data: {
    status: "match_found" | "no_match";
    matchedPetId?: string;
    petType: string;
    registeredType?: string;
    confidenceDistance?: number;
    message?: string;
    closestDistance?: number;
    pythonResponse: {
      status: string;
      type: string;
      confidence_distance?: number;
      matched_pet_id?: string;
      registered_type?: string;
      message?: string;
      closest_distance?: number;
    };
  };
  error?: string;
}

export interface PetData {
  faiss_id: number;
  pet_id: string;
  type: "Dog" | "Cat";
}

export interface GetPetsResponse {
  success: boolean;
  message: string;
  data: {
    totalPets: number;
    pets: PetData[];
    pythonResponse: any;
  };
}

const lostAndFoundApi = {
  /**
   * Register a pet with biometric data
   */
  registerPet: async (imageFile: File, petId: string) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("petId", petId);

      const response = await axiosClient.post<RegisterPetResponse>(
        "/lost-and-found/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: "Pet registration failed",
        data: null as any,
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Identify a pet from an image
   */
  identifyPet: async (imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await axiosClient.post<IdentifyPetResponse>(
        "/lost-and-found/identify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: "Pet identification failed",
        data: null as any,
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Get all registered pets
   */
  getAllPets: async () => {
    try {
      const response = await axiosClient.get<GetPetsResponse>(
        "/lost-and-found/pets"
      );

      if (response.data.success) {
        return response.data.data.pets;
      }
      return [];
    } catch (error: any) {
      console.error("Error fetching pets:", error);
      return [];
    }
  },

  /**
   * Check service health
   */
  checkHealth: async () => {
    try {
      const response = await axiosClient.get("/lost-and-found/health");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: "Biometric AI service is not available",
        error: error.message,
      };
    }
  },
};

export default lostAndFoundApi;
