import React from 'react';
import { Modal } from '../../components/ui/Modal';
import type { ListTicketResponseDto } from '../../types';

interface QRDisplayModalProps {
  ticket: ListTicketResponseDto | null;
  onClose: () => void;
}

export const QRDisplayModal: React.FC<QRDisplayModalProps> = ({ ticket, onClose }) => {
  return (
    <Modal isOpen={Boolean(ticket)} onClose={onClose} title="Entry QR Pass">
      {ticket && (
        <div className="flex flex-col items-center text-center p-4">
          <p className="font-semibold text-gray-900">{ticket.ticketType?.name || 'Entry Pass'}</p>
          <p className="text-xs text-gray-500 mb-4">Price: {ticket.ticketType?.price} DZD</p>
          
          <div className="border p-4 rounded-xl bg-white shadow-inner flex flex-col items-center">
            <img
              src={`http://localhost:8085/api/v1/tickets/${ticket.id}/qr-codes`}
              alt="Ticket QR Code"
              className="h-56 w-56 object-contain"
            />
          </div>
          <p className="mt-3 text-[10px] text-gray-400 font-mono">Ticket ID: {ticket.id}</p>
        </div>
      )}
    </Modal>
  );
};