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
          <p className="font-semibold text-gray-900">{ticket.ticketType?.name}</p>
          <p className="text-xs text-gray-500 mb-4">Price: {ticket.ticketType?.price} DZD</p>
          <div className="border p-4 rounded-xl bg-white shadow-inner">
            <div className="h-48 w-48 flex items-center justify-center bg-gray-100 text-xs text-gray-500 p-2 break-all font-mono">
              Pass ID: {ticket.id}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};