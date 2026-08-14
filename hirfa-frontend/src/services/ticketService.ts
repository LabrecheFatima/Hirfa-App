import axiosInstance from './axioInstance';

export const ticketService = {
  getMyTickets: async () => {
    const response = await axiosInstance.get('/tickets');
    return response.data;
  },

  // Requires both eventId and ticketTypeId to construct the backend path
  purchaseTicket: async (eventId: string, ticketTypeId: string) => {
    const response = await axiosInstance.post(
      `/events/${eventId}/ticket-types/${ticketTypeId}/tickets`
    );
    return response.data; 
  },
};