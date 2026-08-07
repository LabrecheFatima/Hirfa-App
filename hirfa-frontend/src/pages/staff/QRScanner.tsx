import React, { useState } from 'react';
import { validationService } from '../../services/validationService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TicketValidationMethod, TicketValidationEnum, type TicketValidationResponseDto } from '../../types';

export const QRScanner: React.FC = () => {
  const [ticketId, setTicketId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TicketValidationResponseDto | null>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim()) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await validationService.validateTicket({
        id: ticketId.trim(),
        method: TicketValidationMethod.QR_SCAN,
      });
      setResult(res);
    } catch (err: any) {
      setResult({
        ticketId: ticketId.trim(),
        status: TicketValidationEnum.INVALID,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff Ticket Check-In</h1>
        <p className="text-sm text-gray-500">Scan or enter ticket UUID for door validation.</p>
      </div>

      <Card>
        <form onSubmit={handleValidate} className="space-y-4">
          <Input
            label="Ticket UUID / Hash"
            placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
          />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Validate Entry Pass
          </Button>
        </form>
      </Card>

      {result && (
        <Card
          className={`border-l-4 ${
            result.status === TicketValidationEnum.VALID
              ? 'border-l-green-500 bg-green-50'
              : 'border-l-red-500 bg-red-50'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {result.status === TicketValidationEnum.VALID ? '✅' : '❌'}
            </span>
            <div>
              <h3
                className={`font-bold ${
                  result.status === TicketValidationEnum.VALID ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {result.status === TicketValidationEnum.VALID ? 'Access Granted' : 'Access Denied'}
              </h3>
              <p className="text-xs text-gray-600 mt-1">Ticket ID: {result.ticketId}</p>
              <p className="text-xs text-gray-600">Validation Status: {result.status}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};