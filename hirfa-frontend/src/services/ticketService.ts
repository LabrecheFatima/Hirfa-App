import axiosInstance from './axioInstance';

export const ticketService = {
  getMyTickets: async () => {
    const response = await axiosInstance.get('/api/v1/tickets');
    return response.data;
  },

  // Requires both eventId and ticketTypeId to construct the backend path
  purchaseTicket: async (eventId: string, ticketTypeId: string) => {
    const response = await axiosInstance.post(
      `/api/v1/events/${eventId}/ticket-types/${ticketTypeId}/tickets`
    );
    return response.data; 
  },
};