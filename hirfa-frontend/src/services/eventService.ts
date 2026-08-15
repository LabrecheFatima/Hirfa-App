import api from './api';
import type { 
  CreateEventRequestDto, 
  ListEventResponseDto, 
  ListPublishedEventResponseDto 
} from '../types';

export const eventService = {
  getPublishedEvents: async (): Promise<ListPublishedEventResponseDto[]> => {
    const response = await api.get('/published-events');
    return response.data.content || response.data || [];
  },

  getPublishedEventDetails: async (id: string) => {
    const response = await api.get(`/published-events/${id}`);
    return response.data;
  },

  getManagedEvents: async (): Promise<ListEventResponseDto[]> => {
    const response = await api.get('/events');
    return response.data.content || response.data || [];
  },

  createEvent: async (data: CreateEventRequestDto): Promise<ListEventResponseDto> => {
    const response = await api.post('/events', data);
    return response.data;
  },

  updateEvent: async (id: string, data: Partial<CreateEventRequestDto>): Promise<ListEventResponseDto> => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};