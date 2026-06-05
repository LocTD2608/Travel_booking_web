import request from './index';

// GET /api/users (Admin only, cần JWT)
export const getAllUsers = () =>
  request.get('/users');

// PUT /api/users/:id (Admin only)
export const updateUser = (id: string | number, data: Record<string, any>) =>
  request.put(`/users/${id}`, data);

// DELETE /api/users/:id (Admin only)
export const deleteUser = (id: string | number) =>
  request.delete(`/users/${id}`);
