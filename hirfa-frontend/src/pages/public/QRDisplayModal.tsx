import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import type { ListTicketResponseDto } from '../../types';

interface QRDisplayModalProps {
  ticket: ListTicketResponseDto | null;
  onClose: () => void;
}

export const QRDisplayModal: React.FC<QRDisplayModalProps> = ({ ticket, onClose }) => {
  const { token } = useAuth();
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!ticket) return;

    let isMounted = true;
    let createdObjectUrl: string | null = null;

    const fetchQrCode = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const authToken = token || localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:8085/api/v1/tickets/${ticket.id}/qr-codes`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load QR code image');
        }

        const blob = await response.blob();
        createdObjectUrl = URL.createObjectURL(blob);

        if (isMounted) {
          setQrImageUrl(createdObjectUrl);
        }
      } catch (err) {
        console.error('Error fetching ticket QR code:', err);
        if (isMounted) {
          setIsError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchQrCode();

    return () => {
      isMounted = false;
      if (createdObjectUrl) {
        URL.revokeObjectURL(createdObjectUrl);
      }
      setQrImageUrl(null);
    };
  }, [ticket, token]);

  return (
    <Modal isOpen={Boolean(ticket)} onClose={onClose} title="Entry QR Pass">
      {ticket && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center text-center p-2"
        >
          <p className="font-extrabold text-slate-900 text-base">{ticket.ticketType?.name || 'Entry Pass'}</p>
          <p className="text-xs text-slate-500 mb-4">Price: {ticket.ticketType?.price} DZD</p>

          <div className="border border-slate-200 p-4 rounded-2xl bg-white shadow-xs flex flex-col items-center justify-center min-h-[240px] min-w-[240px]">
            {isLoading && (
              <p className="text-xs text-slate-400 animate-pulse font-medium">Generating entry QR code...</p>
            )}

            {isError && (
              <p className="text-xs text-rose-500 font-semibold">Failed to render QR Code pass.</p>
            )}

            {!isLoading && !isError && qrImageUrl && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={qrImageUrl}
                alt="Ticket QR Code"
                className="h-56 w-56 object-contain"
              />
            )}
          </div>

          <p className="mt-4 text-[10px] text-slate-400 font-mono tracking-tight">
            Ticket ID: {ticket.id}
          </p>
        </motion.div>
      )}
    </Modal>
  );
};