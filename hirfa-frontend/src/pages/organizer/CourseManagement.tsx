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
  const {
    managedEvents,
    isLoading,
    isError,
    createEvent,
    isCreating,
    updateEvent,
    isUpdating,
    deleteEvent,
  } = useEvents();

  const eventsList: ListEventResponseDto[] = Array.isArray(managedEvents)
    ? managedEvents
    : (managedEvents as any)?.content || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(getInitialFormData());

  const handleOpenCreateModal = () => {
    setEditingEventId(null);
    setFormData(getInitialFormData());
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: ListEventResponseDto) => {
    setEditingEventId(event.id);
    setFormError(null);

    const mappedTicketTypes =
      event.ticketTypes && event.ticketTypes.length > 0
        ? event.ticketTypes.map((tt: any) => ({
            id: tt.id,
            name: tt.name,
            price: tt.price,
            description: tt.description || '',
            totalAvailable: tt.totalAvailable,
          }))
        : [
            {
              name: 'Standard Pass',
              price: 1000,
              description: 'General admission pass',
              totalAvailable: 50,
            },
          ];

    setFormData({
      id: event.id,
      name: event.name,
      venue: event.venue,
      start: event.start ? event.start.slice(0, 16) : getDefaultDateTime(1, 9),
      end: event.end ? event.end.slice(0, 16) : getDefaultDateTime(1, 17),
      salesStart: event.salesStart ? event.salesStart.slice(0, 16) : getDefaultDateTime(0, 8),
      salesEnd: event.salesEnd ? event.salesEnd.slice(0, 16) : getDefaultDateTime(1, 8),
      status: event.status || EventStatusEnum.DRAFT,
      ticketTypes: mappedTicketTypes,
    });

    setIsModalOpen(true);
  };

  const handleAddTicketType = () => {
    setFormData({
      ...formData,
      ticketTypes: [
        ...formData.ticketTypes,
        { name: '', price: 0, description: '', totalAvailable: 50 },
      ],
    });
  };

  const handleRemoveTicketType = (index: number) => {
    if (formData.ticketTypes.length === 1) return;
    const updated = formData.ticketTypes.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, ticketTypes: updated });
  };

  const handleTicketTypeChange = (index: number, field: string, value: any) => {
    const updated = [...formData.ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, ticketTypes: updated });
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(eventId);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete event.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name?.trim()) {
      setFormError('Event Name is required.');
      return;
    }
    if (!formData.venue?.trim()) {
      setFormError('Venue Location is required.');
      return;
    }

    try {
      const payload = {
        ...formData,
        start: formatLocalDateTime(formData.start),
        end: formatLocalDateTime(formData.end),
        salesStart: formatLocalDateTime(formData.salesStart || formData.start),
        salesEnd: formatLocalDateTime(formData.salesEnd || formData.end),
      };

      if (editingEventId) {
        await updateEvent({ id: editingEventId, data: payload });
      } else {
        await createEvent(payload);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Create Event Error:', err);
      const backendError =
        err?.response?.data?.message || err?.response?.data?.error || 'Failed to save event.';
      setFormError(backendError);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Organiser Dashboard</h1>
          <p className="text-sm text-slate-500">Manage course listings, schedules, and ticket pass tiers.</p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
        >
          + Create New Course
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-500 font-medium">Loading managed courses...</div>
      ) : isError ? (
        <div className="p-8 text-center text-rose-600 font-medium">Failed to load courses. Please refresh.</div>
      ) : eventsList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white shadow-xs">
          <h3 className="text-base font-bold text-slate-900">No courses found</h3>
          <p className="mt-1 text-xs text-slate-500">Get started by creating your first workshop course pass tier.</p>
          <div className="mt-5">
            <Button
              onClick={handleOpenCreateModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              + Create New Course
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {eventsList.map((event: ListEventResponseDto) => (
            <Card key={event.id} className="border border-slate-200/80 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{event.name}</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                    event.status === EventStatusEnum.PUBLISHED
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : event.status === EventStatusEnum.CANCELLED
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {event.status || EventStatusEnum.DRAFT}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                <p><strong className="text-slate-800">Venue:</strong> {event.venue}</p>
                <p><strong className="text-slate-800">Start:</strong> {event.start ? new Date(event.start).toLocaleString() : 'TBA'}</p>
                <p><strong className="text-slate-800">End:</strong> {event.end ? new Date(event.end).toLocaleString() : 'TBA'}</p>
                <p><strong className="text-slate-800">Configured Tiers:</strong> {event.ticketTypes ? event.ticketTypes.length : 0}</p>
              </div>

              <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEditModal(event)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200/60 hover:bg-emerald-100 transition-colors"
                >
                  Edit Course
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg border border-rose-200/60 hover:bg-rose-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEventId ? 'Edit Course' : 'Create New Course'}
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          {formError && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200">
              {formError}
            </div>
          )}

          <Input
            label="Course Name"
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

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Course Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatusEnum })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
            >
              <option value={EventStatusEnum.DRAFT}>DRAFT</option>
              <option value={EventStatusEnum.PUBLISHED}>PUBLISHED</option>
              <option value={EventStatusEnum.CANCELLED}>CANCELLED</option>
              <option value={EventStatusEnum.COMPLETED}>COMPLETED</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Course Start"
              type="datetime-local"
              required
              value={formData.start || ''}
              onChange={(e) => setFormData({ ...formData, start: e.target.value })}
            />
            <Input
              label="Course End"
              type="datetime-local"
              required
              value={formData.end || ''}
              onChange={(e) => setFormData({ ...formData, end: e.target.value })}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                Ticket Tiers & Pricing
              </h4>
              <button
                type="button"
                onClick={handleAddTicketType}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                + Add Ticket Tier
              </button>
            </div>

            {formData.ticketTypes.map((tier: any, index: number) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-3 shadow-xs relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Tier #{index + 1}
                  </span>
                  {formData.ticketTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTicketType(index)}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Pass Name"
                    placeholder="e.g. VIP, Standard"
                    required
                    value={tier.name || ''}
                    onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                  />
                  <Input
                    label="Price (DZD)"
                    type="number"
                    required
                    value={tier.price || 0}
                    onChange={(e) =>
                      handleTicketTypeChange(index, 'price', Number(e.target.value))
                    }
                  />
                </div>

                <Input
                  label="Total Available Quantity"
                  type="number"
                  required
                  value={tier.totalAvailable || 0}
                  onChange={(e) =>
                    handleTicketTypeChange(index, 'totalAvailable', Number(e.target.value))
                  }
                />
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 mt-2"
            isLoading={isCreating || isUpdating}
          >
            {editingEventId ? 'Save Changes' : 'Save & Publish Course'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};