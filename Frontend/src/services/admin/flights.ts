import request from './index';
import type { Flight } from './typing';

export const getFlights = (params?: Record<string, any>) =>
  request.get('/flights', { params });

export const createFlight = (data: Partial<Flight>) =>
  request.post('/flights', data);

export const updateFlight = (id: string, data: Partial<Flight>) =>
  request.put(`/flights/${id}`, data);

export const deleteFlight = (id: string) =>
  request.delete(`/flights/${id}`);
