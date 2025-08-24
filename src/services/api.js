import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';

const api = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const topicsAPI = {
  getByCategory: (categorySlug) => api.get(`/topics/category/${categorySlug}`),
  getById: (id) => api.get(`/topics/${id}`),
  create: (topicData) => api.post('/topics', topicData),
  update: (id, topicData) => api.put(`/topics/${id}`, topicData),
  delete: (id) => api.delete(`/topics/${id}`),
};

export const questionsAPI = {
  getByTopic: (topicId) => api.get(`/questions/topic/${topicId}`),
  create: (questionData) => api.post('/questions', questionData),
  update: (id, questionData) => api.put(`/questions/${id}`, questionData),
  delete: (id) => api.delete(`/questions/${id}`),
  saveQuizResult: (resultData) => api.post('/questions/quiz-result', resultData),
};

export const uploadAPI = {
  uploadFile: (formData) => {
    return axios.post(`${API_ENDPOINTS.BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;