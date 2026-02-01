import axiosClient from './axios-client';

export interface AiHealth {
  status: string;
  model_loaded: boolean;
  device?: string;
  classes?: string[];
}

export interface PredictionResponse {
  disease: string;
  confidence: number;
  confidencePercent?: string;
  allProbabilities?: Record<string, number>;
  isConfident?: boolean;
  filename?: string;
  timestamp?: string;
}

export const getAiHealth = async (): Promise<AiHealth> => {
  const res = await axiosClient.get('/python-ai/health');
  return res.data.data as AiHealth;
};

export const predict = async (image: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append('image', image);

  const res = await axiosClient.post('/python-ai/predict', formData);
  return res.data.data as PredictionResponse;
};

export default {
  getAiHealth,
  predict,
};
