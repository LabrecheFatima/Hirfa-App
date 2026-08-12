import React, { useEffect, useState } from 'react';
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
    // Early exit if modal is closed or ticket is missing
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

    // Cleanup memory and reset state asynchronously when unmounting or changing ticket
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
        <div className="flex flex-col items-center text-center p-4">
          <p className="font-semibold text-gray-900">{ticket.ticketType?.name || 'Entry Pass'}</p>
          <p className="text-xs text-gray-500 mb-4">Price: {ticket.ticketType?.price} DZD</p>

          <div className="border p-4 rounded-xl bg-white shadow-inner flex flex-col items-center justify-center min-h-[240px] min-w-[240px]">
            {isLoading && (
              <p className="text-xs text-gray-400 animate-pulse">Generating entry QR code...</p>
            )}

            {isError && (
              <p className="text-xs text-red-500">Failed to render QR Code pass.</p>
            )}

            {!isLoading && !isError && qrImageUrl && (
              <img
                src={qrImageUrl}
                alt="Ticket QR Code"
                className="h-56 w-56 object-contain"
              />
            )}
          </div>

          <p className="mt-3 text-[10px] text-gray-400 font-mono">Ticket ID: {ticket.id}</p>
        </div>
      )}
    </Modal>
  );
};