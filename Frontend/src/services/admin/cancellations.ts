import request from './index';

// GET all cancellation requests
export const getCancellations = () =>
  request.get('/cancellations');

// PUT approve or reject cancellation request
export const updateCancellationStatus = (id: string, status: 'approved' | 'rejected') =>
  request.put(`/cancellations/${id}`, { status });
