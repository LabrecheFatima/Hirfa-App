import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to initiate Chargily payment checkout.';
      setCheckoutError(msg);
    }
  };

  if (isLoading) return <div className="p-12 text-center text-slate-500 font-medium">Loading catalog...</div>;
  if (isError) return <div className="p-12 text-center text-rose-600 font-medium">Failed to load published events.</div>;

  const currentTiers: GetPublishedEventTicketTypeResponseDto[] =
    selectedEvent?.ticketType || selectedEvent?.ticketTypes || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
        >
          ← Main Page
        </Link>

        <Link
          to="/my-tickets"
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60 hover:bg-emerald-100 transition-colors"
        >
          My Tickets
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Course & Workshop Catalog</h1>
          <p className="text-sm text-slate-500">Discover available sessions and ticket passes.</p>
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
        <AnimatePresence>
          {filteredEvents.map((event, index) => {
            const startDate = getStartDate(event);
            const endDate = getEndDate(event);

            return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                whileHover={{ y: -4 }}
              >
                <Card className="flex flex-col justify-between h-full border border-slate-200/80 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white p-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{event.name}</h3>
                    <p className="mt-2 text-xs text-slate-500">📍 {event.venue}</p>
                    <p className="mt-1 text-xs text-slate-500">
                       {startDate ? new Date(startDate).toLocaleDateString() : 'TBA'} -{' '}
                      {endDate ? new Date(endDate).toLocaleDateString() : 'TBA'}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                      onClick={() => handleOpenModal(event)}
                    >
                      View Pass Options
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Modal isOpen={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)} title={selectedEvent?.name}>
        {selectedEvent && (
          <div className="space-y-4">
            {checkoutError && (
              <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200">
                {checkoutError}
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs space-y-1 text-slate-700">
              <p><strong className="text-slate-900">Venue:</strong> {selectedEvent.venue}</p>
              <p>
                <strong className="text-slate-900">Start:</strong>{' '}
                {getStartDate(selectedEvent)
                  ? new Date(getStartDate(selectedEvent)).toLocaleString()
                  : 'TBA'}
              </p>
              <p>
                <strong className="text-slate-900">End:</strong>{' '}
                {getEndDate(selectedEvent)
                  ? new Date(getEndDate(selectedEvent)).toLocaleString()
                  : 'TBA'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Select Pass Tier
              </label>
              {loadingDetails ? (
                <p className="text-xs text-slate-500 animate-pulse">Loading ticket options...</p>
              ) : currentTiers.length > 0 ? (
                <div className="space-y-2">
                  {currentTiers.map((tier) => (
                    <motion.div
                      key={tier.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTier(tier)}
                      className={`cursor-pointer rounded-xl border p-3.5 flex justify-between items-center text-xs transition-all ${
                        selectedTier?.id === tier.id
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-slate-900">{tier.name}</p>
                        <p className="text-slate-500">
                          {tier.description || 'General admission pass'}
                        </p>
                      </div>
                      <p className="font-extrabold text-emerald-700 text-sm">{tier.price} DZD</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No ticket tiers available for this event.</p>
              )}
            </div>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 shadow-xs"
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
    </motion.div>
  );
};