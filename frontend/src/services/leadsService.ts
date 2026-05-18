import api from './api';
import { ApiResponse, Lead, LeadFilters, LeadFormData } from '../types';

export const leadsService = {
  async getLeads(filters: LeadFilters) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const { data } = await api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
    return data;
  },

  async getLeadById(id: string) {
    const { data } = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return data;
  },

  async createLead(leadData: LeadFormData) {
    const { data } = await api.post<ApiResponse<Lead>>('/leads', leadData);
    return data;
  },

  async updateLead(id: string, leadData: Partial<LeadFormData>) {
    const { data } = await api.put<ApiResponse<Lead>>(`/leads/${id}`, leadData);
    return data;
  },

  async deleteLead(id: string) {
    const { data } = await api.delete<ApiResponse<null>>(`/leads/${id}`);
    return data;
  },

  async exportCSV(filters: Omit<LeadFilters, 'page' | 'limit' | 'sort'>) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/leads/export?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
