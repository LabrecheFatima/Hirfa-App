import { axiosInstance } from './axioInstance'; 
import { TicketValidationMethod, type TicketValidationResponseDto } from '../types';

export interface ValidateTicketRequest {
  id: string;
  method: TicketValidationMethod | string;
}

export const validationService = {
  validateTicket: async (payload: ValidateTicketRequest): Promise<TicketValidationResponseDto> => {
    // Uses axiosInstance so the Authorization header is automatically included
    const response = await axiosInstance.post<TicketValidationResponseDto>(
      '/ticket-validations',
      payload
    );
    return response.data;
  },
};