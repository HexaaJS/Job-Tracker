import axios from 'axios';
import { Application, Stats } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Applications
export const fetchApplications = async (params?: {
  status?: string;
  source?: string;
  search?: string;
}): Promise<Application[]> => {
  const { data } = await api.get('/applications', { params });
  return data;
};

export const fetchApplicationById = async (id: string): Promise<Application> => {
  const { data } = await api.get(`/applications/${id}`);
  return data;
};

export const createApplication = async (
  payload: Omit<Application, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Application> => {
  const { data } = await api.post('/applications', payload);
  return data;
};

export const updateApplication = async (
  id: string,
  payload: Partial<Application>
): Promise<Application> => {
  const { data } = await api.put(`/applications/${id}`, payload);
  return data;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await api.delete(`/applications/${id}`);
};

export const fetchStats = async (): Promise<Stats> => {
  const { data } = await api.get('/applications/stats');
  return data;
};