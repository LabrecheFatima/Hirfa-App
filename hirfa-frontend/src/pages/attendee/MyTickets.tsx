import React, { useState } from 'react';
import { useTickets } from '../../hooks/useTickets';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { QRDisplayModal } from '../public/QRDisplayModal';
import { TicketStatusEnum, type ListTicketResponseDto } from '../../types';

export const MyTickets: React.FC = () => {
  const { tickets, isLoading, isError } = useTickets();
  const [activeTicket, setActiveTicket] = useState<ListTicketResponseDto | null>(null);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading ticket wallet...</div>;
  if (isError) return <div className="p-8 text-center text-red-600">Failed to load tickets.</div>;

  const getStatusBadge = (status: TicketStatusEnum) => {
    switch (status) {
      case TicketStatusEnum.PURCHASED:
        return 'bg-green-100 text-green-700';
      case TicketStatusEnum.PENDING_PAYMENT:
        return 'bg-yellow-100 text-yellow-700';
      case TicketStatusEnum.PAYMENT_FAILED:
      case TicketStatusEnum.CANCELLED:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Ticket Wallet</h1>
        <p className="text-sm text-gray-500">View active entry passes and access QR check-in codes.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold uppercase text-indigo-600">
                    {ticket.ticketType?.name || 'General Pass'}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-gray-900">
                    Price: {ticket.ticketType?.price} DZD
                  </h3>
                </div>
                <span className={`rounded px-2 py-0.5 text-xs font-semibold ${getStatusBadge(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
            </div>
            <div className="mt-6 border-t pt-4">
              <Button
                variant="outline"
                className="w-full"
                disabled={ticket.status !== TicketStatusEnum.PURCHASED}
                onClick={() => setActiveTicket(ticket)}
              >
                Show Entry QR Code
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <QRDisplayModal ticket={activeTicket} onClose={() => setActiveTicket(null)} />
    </div>
  );
};