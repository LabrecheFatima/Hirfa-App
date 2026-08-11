import axiosInstance from './axioInstance';
import type {
  ListPublishedEventResponseDto,
  GetPublishedEventDetailsResponseDto,
  ListEventResponseDto,
  CreateEventRequestDto,
} from '../types';

export const eventService = {
  getPublishedEvents: async (): Promise<ListPublishedEventResponseDto[]> => {
    const response = await axiosInstance.get('/api/v1/published-events');
    return response.data;
  },

  // ADDED: Fetch detailed published event with ticketTypes
  getPublishedEventDetails: async (
    eventId: string
  ): Promise<GetPublishedEventDetailsResponseDto> => {
    const response = await axiosInstance.get(`/api/v1/published-events/${eventId}`);
    return response.data;
  },

  getEvents: async (): Promise<ListEventResponseDto[]> => {
    const response = await axiosInstance.get('/api/v1/events');
    return response.data;
  },

  createEvent: async (data: CreateEventRequestDto) => {
    const response = await axiosInstance.post('/api/v1/events', data);
    return response.data;
  },

  updateEvent: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/api/v1/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: string) => {
    const response = await axiosInstance.delete(`/api/v1/events/${id}`);
    return response.data;
  },
};