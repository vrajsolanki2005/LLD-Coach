import api from "./api";
import type { Attempt } from "../types";

export const getAttempt = async (attemptId: string): Promise<Attempt> => {
  const response = await api.get(`/attempts/${attemptId}`);

  return response.data.attempt;
};

export const saveDraft = async (
  attemptId: string,
  data: {
    classes: any[];
    relationships: any[];
    explanation: string;
    code?: string;
  },
) => {
  const response = await api.put(`/attempts/${attemptId}/draft`, data);

  return response.data;
};

export const submitAttempt = async (
  attemptId: string,
  data: {
    classes: any[];
    relationships: any[];
    explanation: string;
    code?: string;
  },
) => {
  const response = await api.post(`/attempts/${attemptId}/submit`, data);

  return response.data;
};

export const getMyAttempts = async (): Promise<Attempt[]> => {
  const response = await api.get("/attempts");

  return response.data.attempts;
};

export const retryAttempt = async (
  attemptId: string
): Promise<Attempt> => {
  const response = await api.post(
    `/attempts/${attemptId}/retry`
  );

  return response.data.attempt;
};
