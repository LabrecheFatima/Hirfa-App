import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/eventService';
import type { CreateEventRequestDto } from '../types';

export const useEvents = () => {
  const queryClient = useQueryClient();

  // Public published events query
  const publishedQuery = useQuery({
    queryKey: ['published-events'],
    queryFn: eventService.getPublishedEvents,
  });

  // Organizer managed events query
  const managedQuery = useQuery({
    queryKey: ['events'],
    queryFn: eventService.getEvents,
  });

  const createMutation = useMutation({
    mutationFn: (newEvent: CreateEventRequestDto) => eventService.createEvent(newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['published-events'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      eventService.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['published-events'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['published-events'] });
    },
  });

  const events = Array.isArray(publishedQuery.data)
    ? publishedQuery.data
    : Array.isArray((publishedQuery.data as any)?.content)
    ? (publishedQuery.data as any).content
    : [];

  const managedEvents = Array.isArray(managedQuery.data)
    ? managedQuery.data
    : Array.isArray((managedQuery.data as any)?.content)
    ? (managedQuery.data as any).content
    : [];

  return {
    events,
    managedEvents,
    isLoading: publishedQuery.isLoading || managedQuery.isLoading,
    isError: publishedQuery.isError || managedQuery.isError,
    refetch: () => {
      publishedQuery.refetch();
      managedQuery.refetch();
    },
    createEvent: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateEvent: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteEvent: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};