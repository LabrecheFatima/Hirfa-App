import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services/ticketService';
import { useAuth } from './useAuth';
import type { ListTicketResponseDto } from '../types';

export const useTickets = () => {
  const { authenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-tickets'],
    queryFn: ticketService.getUserTickets,
    // Only execute API request if the user is authenticated
    enabled: !!authenticated,
  });

  const purchaseMutation = useMutation({
    mutationFn: (ticketTypeId: string) => ticketService.purchaseTicket(ticketTypeId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
  });

  const tickets: ListTicketResponseDto[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.content)
    ? (data as any).content
    : [];

  return {
    tickets,
    isLoading,
    isError,
    purchaseTicket: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
  };
};