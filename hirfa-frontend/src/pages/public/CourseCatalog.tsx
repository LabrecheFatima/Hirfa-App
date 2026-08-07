import React, { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { useTickets } from '../../hooks/useTickets';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import type { ListPublishedEventResponseDto, GetPublishedEventTicketTypeResponseDto } from '../../types';

export const CourseCatalog: React.FC = () => {
  const { events, isLoading, isError } = useEvents();
  const { purchaseTicket, isPurchasing } = useTickets();
  const { authenticated, login } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<ListPublishedEventResponseDto | null>(null);
  const [selectedTier] = useState<GetPublishedEventTicketTypeResponseDto | null>(null);

  // Fallback to empty array to guarantee filter never fails
  const safeEvents = Array.isArray(events) ? events : [];

  const filteredEvents = safeEvents.filter(
    (e) =>
      e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.venue?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckout = async () => {
    if (!authenticated) {
      login();
      return;
    }
    if (selectedTier) {
      await purchaseTicket(selectedTier.id);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading catalog...</div>;
  if (isError) return <div className="p-8 text-center text-red-600">Failed to load published events.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event & Workshop Catalog</h1>
          <p className="text-sm text-gray-500">Discover available sessions and ticket passes.</p>
        </div>
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search events or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
              <p className="mt-2 text-xs text-gray-500">📍 {event.venue}</p>
              <p className="mt-1 text-xs text-gray-500">
                📅 {event.start ? new Date(event.start).toLocaleDateString() : 'TBA'} -{' '}
                {event.end ? new Date(event.end).toLocaleDateString() : 'TBA'}
              </p>
            </div>
            <div className="mt-6 border-t pt-4">
              <Button className="w-full" onClick={() => setSelectedEvent(event)}>
                View Pass Options
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)} title={selectedEvent?.name}>
        {selectedEvent && (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-3 text-xs space-y-1 text-gray-700">
              <p><strong>Venue:</strong> {selectedEvent.venue}</p>
              <p><strong>Start:</strong> {selectedEvent.start ? new Date(selectedEvent.start).toLocaleString() : 'TBA'}</p>
              <p><strong>End:</strong> {selectedEvent.end ? new Date(selectedEvent.end).toLocaleString() : 'TBA'}</p>
            </div>

            <Button className="w-full" isLoading={isPurchasing} onClick={handleCheckout}>
              {authenticated ? 'Proceed to Chargily Checkout' : 'Login to Purchase'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};