import axios from 'axios';
import type { 
  AuthResponse, 
  Question, 
  QuestionInput, 
  SubmitAnswerResponse,
  PracticeStats,
  FlashcardResponse 
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  
  getMe: () => api.get('/auth/me'),
};

// Questions
export const questionsAPI = {
  getAll: () => api.get<Question[]>('/questions'),
  
  create: (data: QuestionInput) => api.post<Question>('/questions', data),
  
  bulkCreate: (data: QuestionInput[]) =>
    api.post('/questions/bulk', data),
  
  update: (id: string, data: QuestionInput) =>
    api.put<Question>(`/questions/${id}`, data),
  
  delete: (id: string) => api.delete(`/questions/${id}`),
};

// Practice
export const practiceAPI = {
  getNext: () => api.get<{ question: Question | null; message?: string }>('/practice/next'),
  
  submit: (data: { questionId: string; answer: 'A' | 'B' | 'C' | 'D' }) =>
    api.post<SubmitAnswerResponse>('/practice/submit', data),
  
  getStats: () => api.get<PracticeStats>('/practice/stats'),
  
  reset: () => api.post<{ message: string; total: number }>('/practice/reset'),
};

// Flashcard
export const flashcardAPI = {
  getAll: () => api.get<FlashcardResponse>('/flashcard/all'),
  
  getByIndex: (index: number) =>
    api.get<{ flashcard: Question; currentIndex: number; total: number }>(`/flashcard/${index}`),
};

export default api;
