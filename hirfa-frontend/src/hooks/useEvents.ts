import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/eventService';
import type { EventParams } from '../services/eventService';

// 1. Hook specifically for Public / Attendee event browsing
export const usePublishedEvents = (params: EventParams = {}) => {
  return useQuery({
    queryKey: ['published-events', params],
    queryFn: () => eventService.getPublishedEvents(params),
  });
};

// 2. Hook for Organiser Event Management
export const useOrganizerEvents = (params: EventParams = {}) => {
  return useQuery({
    queryKey: ['organizer-events', params],
    queryFn: () => eventService.getOrganizerEvents(params),
  });
};

// 3. Combined Hook for Organiser Management Dashboard
export const useEvents = (params: EventParams = {}) => {
  const queryClient = useQueryClient();

  // Queries
  const {
    data: managedEvents,
    isLoading: isOrganizerLoading,
    isError: isOrganizerError,
    refetch,
  } = useOrganizerEvents(params);

  const {
    data: events,
    isLoading: isPublishedLoading,
    isError: isPublishedError,
  } = usePublishedEvents(params);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (eventData: unknown) => eventService.createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizer-events'] });
      queryClient.invalidateQueries({ queryKey: ['published-events'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      eventService.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizer-events'] });
      queryClient.invalidateQueries({ queryKey: ['published-events'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (eventId: string) => eventService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizer-events'] });
      queryClient.invalidateQueries({ queryKey: ['published-events'] });
    },
  });

  return {
    events,
    managedEvents,
    isLoading: isOrganizerLoading || isPublishedLoading,
    isError: isOrganizerError || isPublishedError,
    refetch,

    createEvent: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateEvent: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteEvent: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

export const usePublishedEventDetails = (eventId: string) => {
  return useQuery({
    queryKey: ['published-event-details', eventId],
    queryFn: () => eventService.getPublishedEventDetails(eventId),
    enabled: !!eventId,
  });
};