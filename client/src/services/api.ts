import axios, { AxiosResponse } from 'axios';
import { Expense, ExpenseFormData } from '../types/expense';
import { AuthResponse, LoginData, RegisterData } from '../types/auth';

const API_URL = process.env.REACT_APP_API_URL || 'https://lia-plus-expense-tracker.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Auth endpoints
  register: (data: RegisterData): Promise<AxiosResponse<AuthResponse>> => 
    axiosInstance.post('/auth/register', data),

  login: (data: LoginData): Promise<AxiosResponse<AuthResponse>> => 
    axiosInstance.post('/auth/login', data),

  // Expense endpoints
  getAllExpenses: (): Promise<AxiosResponse<Expense[]>> => 
    axiosInstance.get('/expenses'),

  addExpense: (expense: ExpenseFormData): Promise<AxiosResponse<Expense>> => 
    axiosInstance.post('/expenses', expense),

  updateExpense: (id: string, expense: ExpenseFormData): Promise<AxiosResponse<Expense>> => 
    axiosInstance.put(`/expenses/${id}`, expense),

  deleteExpense: (id: string): Promise<AxiosResponse<void>> => 
    axiosInstance.delete(`/expenses/${id}`),
};

export default apiService; 
