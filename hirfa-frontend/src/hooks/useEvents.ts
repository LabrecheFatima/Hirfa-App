import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/eventService';
import type { CreateEventRequestDto } from '../types';

export const useEvents = (options?: { fetchManaged?: boolean }) => {
  const queryClient = useQueryClient();
  const fetchManaged = options?.fetchManaged ?? true;

  // 1. Fetch Events
  const query = useQuery({
    queryKey: ['events', fetchManaged],
    queryFn: () => (fetchManaged ? eventService.getManagedEvents() : eventService.getPublishedEvents()),
  });

  // 2. Create Event Mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateEventRequestDto) => eventService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  // 3. Update Event Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEventRequestDto> }) =>
      eventService.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  // 4. Delete Event Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    events: query.data || [],
    managedEvents: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,

    // Bind mutateAsync so async/await works in CourseManagement.tsx
    createEvent: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateEvent: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteEvent: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};