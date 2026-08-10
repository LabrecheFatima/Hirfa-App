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
  const [selectedTier, setSelectedTier] = useState<GetPublishedEventTicketTypeResponseDto | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Safely unwrap array from Spring Data PageImpl wrapper if needed
  const safeEvents: ListPublishedEventResponseDto[] = Array.isArray(events)
    ? events
    : (events as any)?.content || [];

  const filteredEvents = safeEvents.filter(
    (e) =>
      e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.venue?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper getters for property fallback compatibility (eventStart/start, eventEnd/end)
  const getStartDate = (event: any) => event?.eventStart || event?.start;
  const getEndDate = (event: any) => event?.eventEnd || event?.end;

  const handleOpenModal = (event: ListPublishedEventResponseDto) => {
    setSelectedEvent(event);
    setCheckoutError(null);

    // Read ticket types directly attached to the published event
    const tiers: GetPublishedEventTicketTypeResponseDto[] = (event as any).ticketTypes || [];
    if (tiers.length > 0) {
      setSelectedTier(tiers[0]);
    } else {
      setSelectedTier(null);
    }
  };

  const handleCheckout = async () => {
    if (!authenticated) {
      login();
      return;
    }

    if (!selectedEvent || !selectedTier) return;

    try {
      setCheckoutError(null);
      // Pass both eventId and ticketTypeId to match POST /api/v1/events/{eventId}/ticket-types/{ticketTypeId}/tickets
      const res = await purchaseTicket({
        eventId: selectedEvent.id,
        ticketTypeId: selectedTier.id,
      });

      if (res?.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to initiate payment checkout.';
      setCheckoutError(msg);
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
        {filteredEvents.map((event) => {
          const startDate = getStartDate(event);
          const endDate = getEndDate(event);

          return (
            <Card key={event.id} className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                <p className="mt-2 text-xs text-gray-500">📍 {event.venue}</p>
                <p className="mt-1 text-xs text-gray-500">
                  📅 {startDate ? new Date(startDate).toLocaleDateString() : 'TBA'} -{' '}
                  {endDate ? new Date(endDate).toLocaleDateString() : 'TBA'}
                </p>
              </div>
              <div className="mt-6 border-t pt-4">
                <Button className="w-full" onClick={() => handleOpenModal(event)}>
                  View Pass Options
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)} title={selectedEvent?.name}>
        {selectedEvent && (
          <div className="space-y-4">
            {checkoutError && (
              <div className="rounded bg-red-50 p-2 text-xs text-red-700 border border-red-200">
                {checkoutError}
              </div>
            )}

            <div className="rounded-lg bg-gray-50 p-3 text-xs space-y-1 text-gray-700">
              <p><strong>Venue:</strong> {selectedEvent.venue}</p>
              <p>
                <strong>Start:</strong>{' '}
                {getStartDate(selectedEvent)
                  ? new Date(getStartDate(selectedEvent)).toLocaleString()
                  : 'TBA'}
              </p>
              <p>
                <strong>End:</strong>{' '}
                {getEndDate(selectedEvent)
                  ? new Date(getEndDate(selectedEvent)).toLocaleString()
                  : 'TBA'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Select Pass Tier</label>
              {((selectedEvent as any).ticketTypes || []).length > 0 ? (
                <div className="space-y-2">
                  {((selectedEvent as any).ticketTypes as GetPublishedEventTicketTypeResponseDto[]).map((tier) => (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`cursor-pointer rounded-lg border p-3 flex justify-between items-center text-xs transition-colors ${
                        selectedTier?.id === tier.id
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{tier.name}</p>
                        <p className="text-gray-500">
                          {(tier as any).totalAvailable ?? (tier as any).capacity ?? 'Standard'} spots
                        </p>
                      </div>
                      <p className="font-bold text-indigo-600">{tier.price} DZD</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Standard Pass Available</p>
              )}
            </div>

            <Button
              className="w-full"
              isLoading={isPurchasing}
              disabled={!selectedTier}
              onClick={handleCheckout}
            >
              {authenticated ? 'Proceed to Chargily Checkout' : 'Login to Purchase'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};