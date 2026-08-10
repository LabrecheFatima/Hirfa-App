import React, { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { EventStatusEnum, type CreateEventRequestDto, type ListEventResponseDto } from '../../types';

const getDefaultDateTime = (daysOffset: number, hour: number = 9): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour, 0, 0, 0);

  const pad = (num: number) => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatLocalDateTime = (dateStr?: string): string | undefined => {
  if (!dateStr) return undefined;
  if (dateStr.length === 16) return `${dateStr}:00`;
  return dateStr.split('.')[0].replace('Z', '');
};

const getInitialFormData = (): CreateEventRequestDto => ({
  name: '',
  venue: '',
  start: getDefaultDateTime(1, 9),
  end: getDefaultDateTime(1, 17),
  salesStart: getDefaultDateTime(0, 8),
  salesEnd: getDefaultDateTime(1, 8),
  status: EventStatusEnum.PUBLISHED,
  ticketTypes: [
    {
      name: 'Standard Pass',
      price: 1000,
      description: 'General admission pass',
      totalAvailable: 50,
    },
  ],
});

export const CourseManagement: React.FC = () => {
  const { events, isLoading, isError, createEvent, isCreating } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateEventRequestDto>(getInitialFormData());

  const eventList: ListEventResponseDto[] = Array.isArray(events)
    ? events
    : (events as any)?.content || [];

  const handleOpenModal = () => {
    setFormData(getInitialFormData());
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      const payload: CreateEventRequestDto = {
        ...formData,
        start: formatLocalDateTime(formData.start),
        end: formatLocalDateTime(formData.end),
        salesStart: formatLocalDateTime(formData.salesStart),
        salesEnd: formatLocalDateTime(formData.salesEnd),
      };

      await createEvent(payload);
      setIsModalOpen(false);
    } catch (err: any) {
      const backendError = err?.response?.data?.error || 'Failed to create event.';
      setFormError(backendError);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organiser Dashboard</h1>
          <p className="text-sm text-gray-500">Manage event listings and ticket pass availability.</p>
        </div>
        <Button onClick={handleOpenModal}>+ Create New Event</Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500">Loading managed events...</div>
      ) : isError ? (
        <div className="p-8 text-center text-red-600">Failed to load events. Please refresh.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {eventList.map((event) => (
            <Card key={event.id}>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                  {event.status || EventStatusEnum.DRAFT}
                </span>
              </div>
              <div className="mt-4 space-y-1 text-xs text-gray-500">
                <p>📍 Venue: {event.venue}</p>
                <p>📅 Start: {event.start ? new Date(event.start).toLocaleString() : 'TBA'}</p>
                <p>🏁 End: {event.end ? new Date(event.end).toLocaleString() : 'TBA'}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Event">
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="rounded-md bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
              {formError}
            </div>
          )}

          <Input
            label="Event Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Venue Location"
            required
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                label="Event Start"
                type="datetime-local"
                required
                value={formData.start || ''}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
              />
            </div>
            <div>
              <Input
                label="Event End"
                type="datetime-local"
                required
                value={formData.end || ''}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
              />
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-3">
            <h4 className="text-xs font-semibold text-gray-700">Standard Ticket Tier</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Pass Name"
                value={formData.ticketTypes[0]?.name || ''}
                onChange={(e) => {
                  const updatedTickets = [...formData.ticketTypes];
                  updatedTickets[0].name = e.target.value;
                  setFormData({ ...formData, ticketTypes: updatedTickets });
                }}
              />
              <Input
                label="Price (DZD)"
                type="number"
                value={formData.ticketTypes[0]?.price || 0}
                onChange={(e) => {
                  const updatedTickets = [...formData.ticketTypes];
                  updatedTickets[0].price = Number(e.target.value);
                  setFormData({ ...formData, ticketTypes: updatedTickets });
                }}
              />
            </div>
            <Input
              label="Total Available Quantity"
              type="number"
              value={formData.ticketTypes[0]?.totalAvailable || 0}
              onChange={(e) => {
                const updatedTickets = [...formData.ticketTypes];
                updatedTickets[0].totalAvailable = Number(e.target.value);
                setFormData({ ...formData, ticketTypes: updatedTickets });
              }}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isCreating}>
            Save & Publish Event
          </Button>
        </form>
      </Modal>
    </div>
  );
};