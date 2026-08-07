import { useQuery, useMutation } from '@tanstack/react-query';
import { ticketService } from '../services/ticketService';

export const useTickets = () => {
  // Fetch tickets owned by the authenticated user
  const myTicketsQuery = useQuery({
    queryKey: ['my-tickets'],
    queryFn: ticketService.getUserTickets,
  });

  // Purchase ticket / initiate payment checkout
  const purchaseMutation = useMutation({
    mutationFn: (ticketTypeId: string) => ticketService.purchaseTicket(ticketTypeId),
    onSuccess: (response) => {
      // If the backend DTO returns a payment redirect URL (Chargily)
      if (response && 'checkoutUrl' in response && typeof response.checkoutUrl === 'string') {
        window.location.href = response.checkoutUrl;
      }
    },
  });

  return {
    tickets: myTicketsQuery.data ?? [],
    isLoading: myTicketsQuery.isLoading,
    isError: myTicketsQuery.isError,
    purchaseTicket: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
  };
};