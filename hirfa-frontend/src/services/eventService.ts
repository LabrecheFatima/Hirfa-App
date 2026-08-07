import axiosInstance from './axioInstance';
import type {
  ListPublishedEventResponseDto,
  ListEventResponseDto,
  CreateEventRequestDto,
  CreateEventResponseDto,
} from '../types';

export const eventService = {
  // Public Catalog Endpoint
  getPublishedEvents: async (): Promise<ListPublishedEventResponseDto[]> => {
    const response = await axiosInstance.get('/api/v1/published-events');
    return response.data;
  },

  // Organiser Dashboard Endpoint (includes event 'status')
  getEvents: async (): Promise<ListEventResponseDto[]> => {
    const response = await axiosInstance.get('/api/v1/events');
    return response.data;
  },

  // Organiser Create Event Endpoint
  createEvent: async (data: CreateEventRequestDto): Promise<CreateEventResponseDto> => {
    const response = await axiosInstance.post('/api/v1/events', data);
    return response.data;
  },
};