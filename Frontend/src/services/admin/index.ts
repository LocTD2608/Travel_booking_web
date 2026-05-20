import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT từ localStorage (key 'token' — cùng key với Frontend chính)
request.interceptors.request.use((config) => {
  // Thử lấy token theo nhiều key khác nhau
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('adminToken') ||
    sessionStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn('[Admin API] 401 Unauthorized – token có thể hết hạn hoặc không phải ADMIN');
    }
    if (err?.response?.status === 403) {
      console.warn('[Admin API] 403 Forbidden – tài khoản không có quyền ADMIN');
    }
    return Promise.reject(err);
  },
);

export default request;
