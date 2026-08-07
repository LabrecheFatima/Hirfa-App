import api from './api';
import type { TicketValidationRequestDto, TicketValidationResponseDto } from '../types';

export const validationService = {
  validateTicket: async (dto: TicketValidationRequestDto): Promise<TicketValidationResponseDto> => {
    const response = await api.post('/ticket-validations', dto);
    return response.data;
  },
};