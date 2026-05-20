import request from './index';
import type { Accommodation } from './typing';

export const getAccommodations = (params?: Record<string, any>) =>
  request.get('/hotels', { params });

export const createAccommodation = (data: Partial<Accommodation>) =>
  request.post('/hotels', data);

export const updateAccommodation = (id: string, data: Partial<Accommodation>) =>
  request.put(`/hotels/${id}`, data);

export const deleteAccommodation = (id: string) =>
  request.delete(`/hotels/${id}`);
