import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/eventService';
import type { CreateEventRequestDto } from '../types';

export const useEvents = () => {
  const queryClient = useQueryClient();

  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: eventService.getPublishedEvents,
  });

  const createEventMutation = useMutation({
    mutationFn: (newEvent: CreateEventRequestDto) => eventService.createEvent(newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    events: eventsQuery.data ?? [],
    isLoading: eventsQuery.isLoading,
    isError: eventsQuery.isError,
    error: eventsQuery.error, // Added missing error property
    createEvent: createEventMutation.mutateAsync,
    isCreating: createEventMutation.isPending,
  };
};

export const useEventDetails = (eventId: string) => {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: () => eventService.getPublishedEventById(eventId),
    enabled: Boolean(eventId),
  });
};