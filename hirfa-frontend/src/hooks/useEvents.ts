import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/eventService';
import type { ListEventResponseDto, CreateEventRequestDto } from '../types';

export const useEvents = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
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

  const events: ListEventResponseDto[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.content)
    ? (data as any).content
    : [];

  return {
    events,
    isLoading,
    isError,
    refetch,
    createEvent: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};