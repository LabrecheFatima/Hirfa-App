import api from './api';
import type { 
  CreateEventRequestDto, 
  CreateEventResponseDto, 
  Event, 
  UpdateEventRequestDto, 
  UpdateEventResponseDto 
} from '../types';

export const eventService = {
  getPublishedEvents: async (): Promise<Event[]> => {
    const response = await api.get('/published-events');
    return response.data;
  },

  getPublishedEventById: async (id: string): Promise<Event> => {
    const response = await api.get(`/published-events/${id}`);
    return response.data;
  },

  getOrganiserEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data;
  },

  createEvent: async (dto: CreateEventRequestDto): Promise<CreateEventResponseDto> => {
    const response = await api.post('/events', dto);
    return response.data;
  },

  updateEvent: async (id: string, dto: UpdateEventRequestDto): Promise<UpdateEventResponseDto> => {
    const response = await api.put(`/events/${id}`, dto);
    return response.data;
  },
};