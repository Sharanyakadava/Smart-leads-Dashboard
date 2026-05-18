import api from './api';
import { ApiResponse, User } from '../types';

interface AuthResponseData {
  token: string;
  user: User;
}

export const authService = {
  async register(name: string, email: string, password: string, role = 'sales') {
    const { data } = await api.post<ApiResponse<AuthResponseData>>('/auth/register', {
      name, email, password, role,
    });
    return data;
  },

  async login(email: string, password: string) {
    const { data } = await api.post<ApiResponse<AuthResponseData>>('/auth/login', {
      email, password,
    });
    return data;
  },

  async getProfile() {
    const { data } = await api.get<ApiResponse<User>>('/auth/profile');
    return data;
  },
};
