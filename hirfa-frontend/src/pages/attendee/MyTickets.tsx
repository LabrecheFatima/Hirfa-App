import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTickets } from '../../hooks/useTickets';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { QRDisplayModal } from '../public/QRDisplayModal';
import { TicketStatusEnum, type ListTicketResponseDto } from '../../types';

export const MyTickets: React.FC = () => {
  const { tickets, isLoading, isError } = useTickets();
  const [activeTicket, setActiveTicket] = useState<ListTicketResponseDto | null>(null);

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500 font-medium">Loading ticket wallet...</div>;
  }
  if (isError) {
    return <div className="p-12 text-center text-rose-600 font-medium">Failed to load tickets.</div>;
  }

  // Safely extract ticket array if backend returned Spring Data PageImpl wrapper
  const ticketList: ListTicketResponseDto[] = Array.isArray(tickets)
    ? tickets
    : (tickets as any)?.content || [];

  const getStatusBadge = (status: TicketStatusEnum) => {
    switch (status) {
      case TicketStatusEnum.PURCHASED:
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case TicketStatusEnum.PENDING_PAYMENT:
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case TicketStatusEnum.PAYMENT_FAILED:
      case TicketStatusEnum.CANCELLED:
        return 'bg-rose-100 text-rose-700 border border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">My Ticket Wallet</h1>
        <p className="text-sm text-slate-500">View active entry passes and access QR check-in codes.</p>
      </div>

      {ticketList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white shadow-xs">
          <h3 className="text-base font-bold text-slate-900">No tickets found</h3>
          <p className="mt-1 text-xs text-slate-500">You haven't registered for any event pass yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {ticketList.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -3 }}
            >
              <Card className="flex flex-col justify-between h-full border border-slate-200/80 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white p-5">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                        {ticket.ticketType?.name || 'General Pass'}
                      </span>
                      <h3 className="mt-1 text-base font-extrabold text-slate-900">
                        {ticket.ticketType?.price} DZD
                      </h3>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${getStatusBadge(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <Button
                    variant="outline"
                    className="w-full border-slate-300 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 font-semibold transition-all"
                    disabled={ticket.status !== TicketStatusEnum.PURCHASED}
                    onClick={() => setActiveTicket(ticket)}
                  >
                    Show Entry QR Code
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <QRDisplayModal ticket={activeTicket} onClose={() => setActiveTicket(null)} />
    </motion.div>
  );
};