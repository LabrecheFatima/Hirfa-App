import { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import type { ListPublishedEventResponseDto } from '../types';

export const useEvents = () => {
  const [events, setEvents] = useState<ListPublishedEventResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        // Call the public published events service
        const data = await eventService.getPublishedEvents();

        // This safely extracts the array whether it's wrapped in 'content' or a direct array
        const eventList = Array.isArray(data)
          ? data
          : (data as any)?.content || [];

        setEvents(eventList);
      } catch (err) {
        console.error('Failed to fetch published events in useEvents hook:', err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, isLoading, isError };
};