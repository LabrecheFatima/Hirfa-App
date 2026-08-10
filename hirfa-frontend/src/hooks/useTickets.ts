import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services/ticketService';

export const useTickets = () => {
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading, isError } = useQuery({
    queryKey: ['tickets'],
    queryFn: ticketService.getMyTickets,
  });

  const purchaseMutation = useMutation({
    mutationFn: ({ eventId, ticketTypeId }: { eventId: string; ticketTypeId: string }) =>
      ticketService.purchaseTicket(eventId, ticketTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  return {
    tickets,
    isLoading,
    isError,
    purchaseTicket: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
  };
};