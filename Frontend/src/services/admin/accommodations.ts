import request from './index';
import type { Accommodation, Room } from './typing';

// Accommodations CRUD
export const getAccommodations = (params?: Record<string, any>) =>
  request.get('/accommodations', { params });

export const createAccommodation = (data: Partial<Accommodation>) =>
  request.post('/accommodations', data);

export const updateAccommodation = (id: string, data: Partial<Accommodation>) =>
  request.put(`/accommodations/${id}`, data);

export const deleteAccommodation = (id: string) =>
  request.delete(`/accommodations/${id}`);

// Rooms CRUD under Accommodation
export const getRooms = (accommodationId: string) =>
  request.get(`/accommodations/${accommodationId}/rooms`);

export const addRoom = (accommodationId: string, data: Partial<Room>) =>
  request.post(`/accommodations/${accommodationId}/rooms`, data);

export const updateRoom = (accommodationId: string, roomId: string, data: Partial<Room>) =>
  request.put(`/accommodations/${accommodationId}/rooms/${roomId}`, data);

export const deleteRoom = (accommodationId: string, roomId: string) =>
  request.delete(`/accommodations/${accommodationId}/rooms/${roomId}`);
