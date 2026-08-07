import api from './api';
import type { GetTicketResponseDto, ListTicketResponseDto, PurchaseTicketResponseDto } from '../types';

export const ticketService = {
  purchaseTicket: async (ticketTypeId: string): Promise<PurchaseTicketResponseDto> => {
    const response = await api.post(`/ticket-types/${ticketTypeId}/tickets`);
    return response.data;
  },

  getUserTickets: async (): Promise<ListTicketResponseDto[]> => {
    const response = await api.get('/tickets');
    return response.data;
  },

  getTicketById: async (ticketId: string): Promise<GetTicketResponseDto> => {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data;
  },
};
