import api from './api';

export type EventParams = {
  page?: number;
  size?: number;
  q?: string;
};

export const eventService = {
  // ==========================================
  // PUBLIC & ATTENDEE ENDPOINTS (No Organiser restriction)
  // ==========================================
  
  getPublishedEvents: async (params: EventParams = {}) => {
    const response = await api.get('/published-events', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        q: params.q,
      },
    });
    return response.data;
  },

  getPublishedEventDetails: async (eventId: string) => {
    const response = await api.get(`/published-events/${eventId}`);
    return response.data;
  },

  // ==========================================
  // ORGANISER MANAGEMENT ENDPOINTS (Requires ORGANISER_ROLE)
  // ==========================================

  getOrganizerEvents: async (params: EventParams = {}) => {
    const response = await api.get('/events', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    });
    return response.data;
  },

  createEvent: async (eventData: unknown) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (eventId: string, eventData: unknown) => {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  },

  deleteEvent: async (eventId: string) => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },
};