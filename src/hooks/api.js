import axios from 'axios';
import { apiUrl } from '../config';

const api = axios.create({
  baseURL: apiUrl,
});

// Set the authorization header for all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});


export default api;
