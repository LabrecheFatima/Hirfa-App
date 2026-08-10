import axiosInstance from './axioInstance';
import type {
  ListPublishedEventResponseDto,
  ListEventResponseDto,
  CreateEventRequestDto,
} from '../types';

export const eventService = {
   getPublishedEvents: async (): Promise<ListPublishedEventResponseDto[]> => {
    const response = await axiosInstance.get('/api/v1/published-events');
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
};