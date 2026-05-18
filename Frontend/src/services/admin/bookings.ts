import request from './index';

// GET /api/dashboard → getDashboardStats
export const getDashboardStats = () =>
  request.get('/dashboard');

// GET /api/booking/stats (Admin, cần JWT) → getBookingStats
export const getBookingStats = (params?: { startDate?: string; endDate?: string }) =>
  request.get('/booking/stats', { params });

// GET /api/booking/user/:userId → getUserBookings (dùng để lấy danh sách tất cả bookings)
export const getAllBookings = (page = 1, limit = 20) =>
  request.get('/booking/user/all', { params: { page, limit } });

// POST /api/booking/cancel/:id → cancelBooking
export const cancelBooking = (id: string | number) =>
  request.post(`/booking/cancel/${id}`);
