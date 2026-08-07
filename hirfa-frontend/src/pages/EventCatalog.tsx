import React, { useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import { useTickets } from '../hooks/useTickets';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import type { Event, TicketType } from '../types';

export const EventCatalog: React.FC = () => {
  const { events, isLoading, isError } = useEvents();
  const { purchaseTicket, isPurchasing } = useTickets();
  const { authenticated, login } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckout = async () => {
    if (!authenticated) {
      login();
      return;
    }
    if (!selectedTicketType) return;

    try {
      await purchaseTicket(selectedTicketType.id);
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center text-red-600 border border-red-200">
        Failed to load catalog. Please verify backend connection.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Explore Craft & Tech Workshops</h1>
          <p className="text-sm text-gray-500">Discover hand-on training sessions and events.</p>
        </div>
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by title or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-gray-500">
          No published events found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="flex flex-col justify-between">
              <div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                  {event.status || 'PUBLISHED'}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">{event.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">{event.description}</p>
                
                <div className="mt-4 space-y-1 text-xs text-gray-500">
                  <p>📍 {event.location}</p>
                  <p>📅 {new Date(event.startDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    setSelectedEvent(event);
                    setSelectedTicketType(event.ticketTypes?.[0] || null);
                  }}
                >
                  View Details & Book
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Ticket Purchase Modal */}
      <Modal
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title}
      >
        {selectedEvent && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{selectedEvent.description}</p>
            <div className="rounded-lg bg-gray-50 p-3 text-xs space-y-1 text-gray-700">
              <p><strong>Venue:</strong> {selectedEvent.location}</p>
              <p><strong>Date:</strong> {new Date(selectedEvent.startDate).toLocaleString()}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">
                Select Pass Type
              </label>
              <div className="space-y-2">
                {selectedEvent.ticketTypes?.map((ticketType) => (
                  <div
                    key={ticketType.id}
                    onClick={() => setSelectedTicketType(ticketType)}
                    className={`cursor-pointer rounded-lg border p-3 text-sm transition-all ${
                      selectedTicketType?.id === ticketType.id
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between font-medium">
                      <span>{ticketType.name}</span>
                      <span className="text-indigo-600">{ticketType.price} DZD</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button
                className="w-full"
                isLoading={isPurchasing}
                disabled={!selectedTicketType}
                onClick={handleCheckout}
              >
                {authenticated ? 'Proceed to Chargily Payment' : 'Login to Purchase'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};