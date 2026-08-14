import axios from 'axios';
import type {
  ListPublishedEventResponseDto,
  GetPublishedEventDetailsResponseDto,
  ListEventResponseDto,
  GetEventDetailsResponseDto,
  CreateEventRequestDto,
  UpdateEventRequestDto,
} from '../types';

const API_BASE_URL = 'http://localhost:8085/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor: Delete Authorization header for public endpoints (/published-events)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const isPublic = config.url?.includes('/published-events');

  if (token && token !== 'null' && token !== 'undefined' && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export const eventService = {
  // PUBLIC ENDPOINTS
  getPublishedEvents: async (q?: string) => {
    const response = await api.get<ListPublishedEventResponseDto[]>('/published-events', {
      params: q ? { q } : {},
    });
    return response.data;
  },

  getPublishedEventDetails: async (eventId: string) => {
    const response = await api.get<GetPublishedEventDetailsResponseDto>(
      `/published-events/${eventId}`
    );
    return response.data;
  },

  // ORGANIZER ENDPOINTS
  listOrganizerEvents: async () => {
    const response = await api.get<ListEventResponseDto[]>('/events');
    return response.data;
  },

  getOrganizerEventDetails: async (eventId: string) => {
    const response = await api.get<GetEventDetailsResponseDto>(`/events/${eventId}`);
    return response.data;
  },

  createEvent: async (data: CreateEventRequestDto) => {
    const response = await api.post('/events', data);
    return response.data;
  },

  updateEvent: async (eventId: string, data: UpdateEventRequestDto) => {
    const response = await api.put(`/events/${eventId}`, data);
    return response.data;
  },

  deleteEvent: async (eventId: string) => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },
};