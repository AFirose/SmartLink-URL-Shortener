import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const shortenUrl = (originalUrl) => API.post('/url/shorten', { originalUrl });
export const getUserUrls = () => API.get('/url/user/me');

export default API;