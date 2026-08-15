import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import { useTickets } from '../../hooks/useTickets';
import { useAuth } from '../../hooks/useAuth';
import { eventService } from '../../services/eventService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import type { ListPublishedEventResponseDto, GetPublishedEventTicketTypeResponseDto } from '../../types';

export const CourseCatalog: React.FC = () => {
  const { events, isLoading, isError } = useEvents();
  const { purchaseTicket, isPurchasing } = useTickets();
  const { authenticated, login, roles } = useAuth();
  const isStaff = roles.map((r) => r.toUpperCase()).includes('STAFF');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [selectedTier, setSelectedTier] = useState<GetPublishedEventTicketTypeResponseDto | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const safeEvents: ListPublishedEventResponseDto[] = Array.isArray(events)
    ? events
    : (events as any)?.content || [];

  const filteredEvents = safeEvents.filter(
    (e) =>
      e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.venue?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStartDate = (event: any) => event?.eventStart || event?.start;
  const getEndDate = (event: any) => event?.end || event?.eventEnd;

  const handleOpenModal = async (event: ListPublishedEventResponseDto) => {
    setSelectedEvent(event);
    setCheckoutError(null);
    setSelectedTier(null);
    setLoadingDetails(true);

    try {
      const details = await eventService.getPublishedEventDetails(event.id);
      setSelectedEvent(details);

      const tiers: GetPublishedEventTicketTypeResponseDto[] = details.ticketType || [];
      if (tiers.length > 0) {
        setSelectedTier(tiers[0]);
      }
    } catch (err) {
      console.error('Failed to load event ticket details', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCheckout = async () => {
    if (!authenticated) {
      login();
      return;
    }

    if (!selectedEvent || !selectedTier) return;

    if (selectedTier.price < 50) {
      setCheckoutError('Chargily payments require a minimum ticket price of 50 DZD.');
      return;
    }

    try {
      setCheckoutError(null);
      const res = await purchaseTicket({
        eventId: selectedEvent.id,
        ticketTypeId: selectedTier.id,
      });

      if (res?.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } catch (err: any) {
      console.error('Checkout failed:', err);
      // Extract specific backend/Chargily error messages
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to initiate Chargily payment checkout.';
      setCheckoutError(msg);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading catalog...</div>;
  if (isError) return <div className="p-8 text-center text-red-600">Failed to load published events.</div>;

  const currentTiers: GetPublishedEventTicketTypeResponseDto[] =
    selectedEvent?.ticketType || selectedEvent?.ticketTypes || [];

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
        >
          ← Main Page
        </Link>

        <Link
          to="/my-tickets"
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
        >
         My Tickets
        </Link>
      </div>

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
              {loadingDetails ? (
                <p className="text-xs text-gray-500">Loading ticket options...</p>
              ) : currentTiers.length > 0 ? (
                <div className="space-y-2">
                  {currentTiers.map((tier) => (
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
                          {tier.description || 'General admission pass'}
                        </p>
                      </div>
                      <p className="font-bold text-indigo-600">{tier.price} DZD</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No ticket tiers available for this event.</p>
              )}
            </div>

            <Button
              className="w-full"
              isLoading={isPurchasing}
              disabled={!selectedTier || loadingDetails || isStaff}
              onClick={handleCheckout}
            >
              {isStaff
                ? 'Staff Accounts Cannot Purchase Passes'
                : !authenticated
                ? 'Login to Purchase'
                : (selectedTier?.price ?? 0) < 50
                ? 'Minimum Price Required for Online Checkout (50 DZD)'
                : 'Proceed to Chargily Checkout'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};